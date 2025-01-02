package com.example.generation_service.scheduler;

import com.example.generation_service.facades.TestFacade;
import com.example.generation_service.models.GenerateTestMessage;
import com.example.generation_service.services.activity.TestGenerationActivityService;
import com.example.generation_service.services.CommandService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Component
@RequiredArgsConstructor
@Slf4j
public class CommandsScheduler {

  private final CommandService commandService;
  private final TestFacade testFacade;
  private final TestGenerationActivityService activityService;

  private final ExecutorService executorService = Executors.newFixedThreadPool(10);

  @Scheduled(fixedDelay = 20000)
  public void processMessage() {
    final Optional<GenerateTestMessage> commandOpt = commandService.getCommand();

    if (commandOpt.isPresent()) {
      GenerateTestMessage command = commandOpt.get();
      processCommand(command);
    }
  }

  private void processCommand(GenerateTestMessage command) {
    executorService.submit(() -> {
      try {
        Optional.of(command)
              .map(GenerateTestMessage::getCid)
              .ifPresent(cid -> MDC.put("cid", cid));
        testFacade.generateTestReceiveMessage(command);
      } catch (Exception e) {
        log.error("Error processing command: {}", command, e);
        activityService.failActivity(command.getHashKey(), command.getCid(), e);
      } finally {
        commandService.deleteMessage(command.getMessageId(), command.getReceipt());
      }
    });
  }
}
