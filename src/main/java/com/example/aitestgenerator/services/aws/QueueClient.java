package com.example.aitestgenerator.services.aws;

import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.model.*;
import com.example.aitestgenerator.models.GenerateTestMessage;
import com.example.aitestgenerator.services.redis.GenericRedisService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class QueueClient {

    private final static int timeoutInSeconds = 300;

    @Value("${aws.sqs-url}")
    public String queueUrl;

    private final GenericRedisService redisService;
    private final AmazonSQS queue;
    private final ObjectMapper objectMapper;
    private final String IN_PROCESS_PREFIX = "message_in_process_";

    public Optional<GenerateTestMessage> getMessage() {
        final ReceiveMessageResult receiveMessageResult = queue.receiveMessage(new ReceiveMessageRequest(queueUrl)
              .withMaxNumberOfMessages(1)
              .withVisibilityTimeout(timeoutInSeconds));
        final List<Message> messages = receiveMessageResult.getMessages();
        if (messages.isEmpty()) {
            return Optional.empty();
        }
        final Message message = messages.get(0);
        final String messageId = message.getMessageId();
        final String processingKey = IN_PROCESS_PREFIX + message.getMessageId();

        if (redisService.getObjectAsString(processingKey, String.class).isPresent()) {
            log.info("Message {} is already being processed, skipping.", messageId);
            extendVisibilityTimeout(message);
            return Optional.empty();
        }

        final String messageBody = message.getBody();
        try {
            redisService.saveObjectAsString(processingKey, message.getReceiptHandle());
            final GenerateTestMessage generateTestMessage = objectMapper.readValue(messageBody, GenerateTestMessage.class);
            generateTestMessage.setReceipt(message.getMessageId());
            return Optional.of(generateTestMessage);
        } catch (IOException e) {
            log.error("An error occurred while parsing message body: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public void deleteMessage(final String messageId) {
        try {
            final String processingKey = IN_PROCESS_PREFIX + messageId;
            final Optional<String> receipt = redisService.getObjectAsString(processingKey, String.class);
            receipt.ifPresent(s -> queue.deleteMessage(new DeleteMessageRequest(queueUrl, s)));
            redisService.deleteObjectAsString(processingKey);

            log.info("Message was deleted from the queue. Message : {} ", messageId.substring(0, 10));
        } catch (Exception e) {
            log.error("An error occurred during deleting message from the queue. Message id : {}", messageId);
        }
    }

    public void sendMessage(GenerateTestMessage message) {
        try {
            log.info("Adding message to the queue to generate test. Message: {}", message);
            SendMessageRequest messageRequest =
                    new SendMessageRequest(queueUrl, String.valueOf(objectMapper.writeValueAsString(message)));
            queue.sendMessage(messageRequest);
        } catch (Exception e) {
            log.error("An error occurred during saving message to the queue. Message: {}",
                  message, e);
        }
    }

    private void updateVisibilityTimeout(final String receiptHandle) {
        final ChangeMessageVisibilityRequest request = new ChangeMessageVisibilityRequest()
              .withQueueUrl(queueUrl)
              .withReceiptHandle(receiptHandle)
              .withVisibilityTimeout(timeoutInSeconds);

        queue.changeMessageVisibility(request);
    }

    private void extendVisibilityTimeout(Message message) {
        ChangeMessageVisibilityRequest request = new ChangeMessageVisibilityRequest()
              .withQueueUrl(queueUrl)
              .withReceiptHandle(message.getReceiptHandle())
              .withVisibilityTimeout(timeoutInSeconds);

        queue.changeMessageVisibility(request);
        log.info("Extended visibility timeout for message: {}", message.getMessageId());
    }

    public void purgeQueue() {
        try {
            log.info("Purging all messages from the queue: {}", queueUrl);
            PurgeQueueRequest purgeQueueRequest = new PurgeQueueRequest().withQueueUrl(queueUrl);
            queue.purgeQueue(purgeQueueRequest);
            log.info("Queue purged successfully.");
        } catch (PurgeQueueInProgressException e) {
            log.error("Purge already in progress. Please wait and try again.", e);
        } catch (AmazonSQSException e) {
            log.error("An error occurred while purging the queue: {}", e.getMessage());
        }
    }



}
