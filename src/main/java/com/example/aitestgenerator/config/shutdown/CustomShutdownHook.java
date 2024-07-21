package com.example.aitestgenerator.config.shutdown;

import com.amazonaws.util.CollectionUtils;
import com.example.aitestgenerator.exceptionHandler.enumaration.GenerationFailReason;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.enums.GenerationStatus;
import com.example.aitestgenerator.services.CommandService;
import com.example.aitestgenerator.services.TestGeneratingHistoryService;
import com.theokanning.openai.service.OpenAiService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Slf4j
@AllArgsConstructor
public class CustomShutdownHook implements DisposableBean {

    private final CommandService commandService;
    private final TestGeneratingHistoryService historyService;
    private final ShutdownFlag shutdownFlag;
    private final OpenAiService openAiService;

    @Override
    public void destroy() throws Exception {
        openAiService.shutdownExecutor();
        shutdownFlag.setShuttingDown(true);
        log.warn("==================== SHUTDOWN REQUESTED ====================");
        List<TestGeneratingHistory> histories = historyService.findAllByStatus(GenerationStatus.IN_PROCESS);

        if (!CollectionUtils.isNullOrEmpty(histories)) {
            try {
                log.warn("Force closing generations. Ids: {}", histories.stream().map(TestGeneratingHistory::getId).toList());

                histories.stream().map(TestGeneratingHistory::getMessageReceipt).forEach(commandService::deleteMessage);

                histories = histories
                        .stream()
                        .peek(history -> history.setGenerationStatus(GenerationStatus.FAILED))
                        .peek(history -> history.setFailReason(GenerationFailReason.SHUTDOWN_REQUESTED))
                        .peek(history -> history.setGenerationEnd(LocalDateTime.now()))
                        .peek(history -> history.setMessageReceipt(null))
                        .toList();
                historyService.save(histories);
            } catch (final Exception e) {
                log.error("Error when closing generations", e);
            }
        }
    }
}
