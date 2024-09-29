package com.example.aitestgenerator.scheduler;

import com.example.aitestgenerator.facades.TestFacade;
import com.example.aitestgenerator.services.CommandService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class CommandsScheduler {

  private final CommandService commandService;
  private final TestFacade testFacade;

  @Scheduled(fixedDelay = 1000)
  public void processMessage() {
    commandService.getCommand().ifPresent(testFacade::generateTestReceiveMessage);
  }

}
