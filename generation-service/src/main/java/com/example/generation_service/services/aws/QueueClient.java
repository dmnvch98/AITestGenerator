package com.example.generation_service.services.aws;

import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.model.*;
import com.example.generation_service.models.GenerateTestMessage;
import com.example.generation_service.models.activity.TestGenerationActivity;
import com.example.generation_service.models.enums.ActivityStatus;
import com.example.generation_service.services.redis.RedisService;
import com.example.generation_service.utils.Utils;
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

    private final RedisService redisService;
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
        final String processingKey = IN_PROCESS_PREFIX + message.getMessageId();

        final String messageBody = message.getBody();
        try {
            redisService.saveObjectAsString(processingKey, message.getReceiptHandle());
            final GenerateTestMessage generateTestMessage = objectMapper.readValue(messageBody, GenerateTestMessage.class);
            if (shouldSkipMessage(generateTestMessage)) {
                log.info("User [{}] already has active generation, extending messageId=[{}] visibility",
                        generateTestMessage.getUserId(), message.getMessageId());
                extendVisibilityTimeout(message);
                return Optional.empty();
            }
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

            log.info("Message was deleted from the queue. Message : {} ", messageId.substring(0, 8));
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

    private boolean shouldSkipMessage(final GenerateTestMessage generateTestMessage) {
        final String hashKey = Utils.getGenerationHashKey(generateTestMessage.getUserId());
        final Set<TestGenerationActivity> activities = redisService.getAllObjectsFromHash(hashKey, TestGenerationActivity.class);
        final long activitiesInProcessNum = activities
                .stream()
                .filter(activity -> ActivityStatus.IN_PROCESS.equals(activity.getStatus()))
                .count();
        return activitiesInProcessNum >= 1;
    }

}
