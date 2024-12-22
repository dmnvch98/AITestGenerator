package com.example.generation_service.controllers;

import com.example.generation_service.config.security.service.PrincipalUser;
import com.example.generation_service.dto.sse.SseHandshakeResponseDto;
import com.example.generation_service.facades.SseFacade;
import com.example.generation_service.services.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@RestController
@RequestMapping("api/v1/sse")
@RequiredArgsConstructor
@Slf4j
public class SseController {

    private final SseFacade sseFacade;
    private final NotificationService notificationService;

    @PostMapping
    public SseHandshakeResponseDto handShake(final Authentication authentication) {
        final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        log.info("Get sse handshake request for user {}", userId);

        return SseHandshakeResponseDto.builder()
                .subscriptionId(sseFacade.generateAndSaveUserSubscriptionId(userId))
                .build();

    }

    @GetMapping("/subscribe")
    public SseEmitter subscribe(@RequestParam("subId") String subId) {
        final Long userId = sseFacade.getUserIdBySubId(subId);
        log.info("Get sse subscribe request for user {}", userId);

        SseEmitter emitter = notificationService.createEmitter(userId);

        try {
            emitter.send(SseEmitter.event().name("connection").data("OK"));
        } catch (IOException ignored) {}

        return emitter;
    }
}
