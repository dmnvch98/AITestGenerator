package com.example.generation_service.services;

import com.example.generation_service.models.GenerateTestMessage;
import com.example.generation_service.services.aws.QueueClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommandService {

    private final QueueClient queueClient;

    public void sendCommand(final GenerateTestMessage message) {
        queueClient.sendMessage(message);
    }

    public Optional<GenerateTestMessage> getCommand() {
        return queueClient.getMessage();
    }

    public void deleteMessage(final String messageId, final String receipt) {
        queueClient.deleteMessage(messageId, receipt);
    }

    public void purgeQueue() {
        queueClient.purgeQueue();
    }

}
