package com.example.aitestgenerator.config.shutdown;

import com.example.aitestgenerator.exceptionHandler.enumaration.GenerationFailReason;
import com.example.aitestgenerator.services.ActivityService;
import com.theokanning.openai.service.OpenAiService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@AllArgsConstructor
public class CustomShutdownHook implements DisposableBean {

    private final ShutdownFlag shutdownFlag;
    private final OpenAiService openAiService;
    private final ActivityService activityService;

    @Override
    public void destroy() throws Exception {
        openAiService.shutdownExecutor();
        shutdownFlag.setShuttingDown(true);
        log.warn("==================== SHUTDOWN REQUESTED ====================");
        activityService.failAllActivities(GenerationFailReason.SHUTDOWN_REQUESTED);
    }
}
