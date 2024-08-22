package com.example.aitestgenerator.services;

import com.example.aitestgenerator.exceptionHandler.enumaration.GenerationFailReason;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.enums.GenerationStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final TestGeneratingHistoryService testGeneratingHistoryService;
    private final CommandService commandService;

    public void finishGeneration(final TestGeneratingHistory history, final String receipt) {
        commandService.deleteMessage(receipt);
        testGeneratingHistoryService.save(history);
    }

    public void failGeneration(final TestGeneratingHistory history, final Throwable cause) {
        final GenerationFailReason failReason = GenerationFailReason.extractFailureCode(cause);

        failGeneration(history, failReason);
        throw new ResponseStatusException(500, "Test generation failed. History id: " + history.getId(), cause);
    }

    public void failGeneration(TestGeneratingHistory history, final GenerationFailReason failReason) {
        if (history.getMessageReceipt() != null) {
            commandService.deleteMessage(history.getMessageReceipt());
        }

        history = history.toBuilder()
           .generationStatus(GenerationStatus.FAILED)
           .messageReceipt(null)
           .failReason(failReason)
           .build();

        testGeneratingHistoryService.save(history);
    }

    public void failGeneration(final String messageReceipt, final Throwable cause) {
        if (messageReceipt != null) {
            commandService.deleteMessage(messageReceipt);
        }
        throw new ResponseStatusException(500, "Test generation failed", cause);
    }

    public void failGeneration(final Throwable cause) {
        throw new ResponseStatusException(500, "Test generation failed", cause);
    }

}
