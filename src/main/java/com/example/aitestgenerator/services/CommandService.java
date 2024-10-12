package com.example.aitestgenerator.services;

import com.example.aitestgenerator.models.GenerateTestMessage;
import com.example.aitestgenerator.services.aws.QueueClient;
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

    public void deleteMessage(final String receipt) {
        queueClient.deleteMessage(receipt);
    }

    public void purgeQueue() {
        queueClient.purgeQueue();
    }

}
