package com.example.aitestgenerator.config.retriers;

import com.example.aitestgenerator.config.shutdown.ShutdownFlag;
import com.example.aitestgenerator.exceptionHandler.enumaration.GenerationFailReason;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.services.ActivityService;
import com.example.aitestgenerator.services.CommandService;
import com.example.aitestgenerator.services.TestGeneratingHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.retry.RetryCallback;
import org.springframework.retry.RetryContext;
import org.springframework.retry.RetryListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class GenerationRetryListener implements RetryListener {

    private final TestGeneratingHistoryService testGeneratingHistoryService;
    private final CommandService commandService;
    private final ShutdownFlag shutdownFlag;
    private final ActivityService activityService;

    @Override
    public <T, E extends Throwable> boolean open(final RetryContext context, final RetryCallback<T, E> callback) {
        return true;
    }

    @Override
    public <T, E extends Throwable> void close(final RetryContext context, final RetryCallback<T, E> callback,
                                               final Throwable throwable) {
        if (!shutdownFlag.isShuttingDown() && throwable != null) {
            final Long historyId = (Long) context.getAttribute("historyId");
            if (historyId != null) {
                log.error("All retry attempts exhausted. History id [{}] updated to FAILED", historyId);

                TestGeneratingHistory history = testGeneratingHistoryService.findById(historyId);

                if (history.getMessageReceipt() != null) {
                    commandService.deleteMessage(history.getMessageReceipt());
                }

                final GenerationFailReason failReason = GenerationFailReason.extractFailureCode(throwable);

                activityService.failGeneration(history, failReason);
            }
        }
    }

    @Override
    public <T, E extends Throwable> void onError(RetryContext context, RetryCallback<T, E> callback, Throwable throwable) {
        log.error("Retry attempt {} failed.", context.getRetryCount(), throwable);
        if (!shutdownFlag.isShuttingDown() && throwable != null) {
            final Long historyId = (Long) context.getAttribute("historyId");
            if (historyId != null) {
                TestGeneratingHistory history = testGeneratingHistoryService.findById(historyId);
                final GenerationFailReason failReason = GenerationFailReason.extractFailureCode(throwable);

                if (failReason.isFatal()) {
                    activityService.failGeneration(history, throwable);
                }
            } else {
                activityService.failGeneration(throwable);
            }
        }
    }
}
