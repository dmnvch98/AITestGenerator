package com.example.aitestgenerator.services.aws;

import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.model.DeleteMessageRequest;
import com.amazonaws.services.sqs.model.Message;
import com.amazonaws.services.sqs.model.ReceiveMessageResult;
import com.amazonaws.services.sqs.model.SendMessageRequest;
import com.example.aitestgenerator.models.GenerateTestMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class QueueClient {

    @Value("${aws.url}")
    public String queueUrl;

    private final AmazonSQS queue;
    private final ObjectMapper objectMapper;
    private final static int delay = 1;

    public Optional<GenerateTestMessage> getMessage() {
        ReceiveMessageResult receiveMessageResult = queue.receiveMessage(queueUrl);
        List<Message> messages = receiveMessageResult.getMessages();
        if (messages.isEmpty()) {
            return Optional.empty();
        }
        Message message = messages.get(0);
        String messageBody = message.getBody();
        try {
            GenerateTestMessage generateTestMessage = objectMapper.readValue(messageBody, GenerateTestMessage.class);
            return Optional.of(generateTestMessage);
        } catch (IOException e) {
            log.error("An error occurred while parsing message body: {}", e.getMessage());
            return Optional.empty();
        } finally {
            deleteMessage(message.getReceiptHandle());
        }
    }

    public void deleteMessage(final String receipt) {
        try {
            queue.deleteMessage(new DeleteMessageRequest(queueUrl, receipt));
            log.info("Message was deleted the from queue. Receipt : {} ", receipt);
        } catch (Exception e) {
            log.error("An error occurred during deleting message from the queue. Receipt : {}", receipt);
        }
    }

    public void sendMessage(GenerateTestMessage message) {
        try {
            log.info("Adding message to the queue to generate test. User id: {}, Text id: {}" +
                    " Delay : {} sec", message.getUserId(), message.getTextId(), delay);
            SendMessageRequest messageRequest =
                    new SendMessageRequest(queueUrl, String.valueOf(objectMapper.writeValueAsString(message)));
            messageRequest.setDelaySeconds(delay);
            queue.sendMessage(messageRequest);
        } catch (Exception e) {
            log.error("An error occurred during saving message to the queue. User id: {}, Text id: {}",
                    message.getUserId(), message.getTextId(), e);
        }
    }

}
