package com.example.aitestgenerator.scheduler;

import com.example.aitestgenerator.facades.TestFacade;
import com.example.aitestgenerator.services.CommandService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Component
@RequiredArgsConstructor
@Slf4j
public class CommandsScheduler {

  private final CommandService commandService;
  private final TestFacade testFacade;

  // Используем пул потоков для управления параллелизмом
  private final ExecutorService executorService = Executors.newFixedThreadPool(10); // Максимум 10 потоков одновременно

  @Scheduled(fixedDelay = 1000)
  public void processMessage() {
    commandService.getCommand().ifPresent(command -> {
      // Создаем и запускаем отдельный поток для каждого вызова
      executorService.submit(() -> {
        final String cid = UUID.randomUUID().toString();
        MDC.put("cid", cid);
        try {
          testFacade.generateTestReceiveMessage(command);
        } catch (Exception e) {
          log.error("Error processing command: {}", command, e);
        }
      });
    });
  }
}
