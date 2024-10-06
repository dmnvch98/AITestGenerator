package com.example.aitestgenerator.services.aws;

import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.model.*;
import com.example.aitestgenerator.models.GenerateTestMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
@Slf4j
public class QueueClient {

    private final static int timeoutInSeconds = 300;

    @Value("${aws.sqs-url}")
    public String queueUrl;

    private final AmazonSQS queue;
    private final ObjectMapper objectMapper;
    private final Map<String, String> receiptMessageIdMap = new ConcurrentHashMap<>();

    public Optional<GenerateTestMessage> getMessage() {
        final ReceiveMessageResult receiveMessageResult = queue.receiveMessage(new ReceiveMessageRequest(queueUrl)
              .withMaxNumberOfMessages(1)
              .withVisibilityTimeout(timeoutInSeconds));
        final List<Message> messages = receiveMessageResult.getMessages();
        if (messages.isEmpty()) {
            return Optional.empty();
        }
        final Message message = messages.get(0);
        final Optional<String> receiptToUpdate = receiptMessageIdMap.entrySet()
              .stream()
              .filter(entry -> entry.getValue().equals(message.getMessageId()))
              .map(Map.Entry::getKey)
              .findFirst();

        if (receiptToUpdate.isPresent()) {
            log.info("Skipping message with id {} as it's already processing. Updating visibility timeout", message.getMessageId());
            updateVisibilityTimeout(receiptToUpdate.get());
            return Optional.empty();
        }
        final String messageBody = message.getBody();
        try {
            receiptMessageIdMap.put(message.getReceiptHandle(), message.getMessageId());
            final GenerateTestMessage generateTestMessage = objectMapper.readValue(messageBody, GenerateTestMessage.class);
            generateTestMessage.setReceipt(message.getReceiptHandle());
            return Optional.of(generateTestMessage);
        } catch (IOException e) {
            log.error("An error occurred while parsing message body: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public void deleteMessage(final String receipt) {
        try {
            receiptMessageIdMap.remove(receipt);
            queue.deleteMessage(new DeleteMessageRequest(queueUrl, receipt));
            log.info("Message was deleted from the queue. Receipt : {} ", receipt);
        } catch (Exception e) {
            log.error("An error occurred during deleting message from the queue. Receipt : {}", receipt);
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


}
