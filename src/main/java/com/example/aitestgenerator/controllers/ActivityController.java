package com.example.aitestgenerator.controllers;

import com.example.aitestgenerator.dto.tests.TextGenerationHistoryDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/v1/test")
@RestController
@RequiredArgsConstructor
@Slf4j
public class ActivityController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/activity")
    @SendToUser("/queue/TestGeneratingHistory")
    public TextGenerationHistoryDto sendActivityStatus(final TextGenerationHistoryDto historyDto) {
        return historyDto;
    }

    @GetMapping
    public void getMessage() {
        messagingTemplate.convertAndSendToUser("1", "/queue/TestGeneratingHistory", "Hello");
    }


}
