package com.example.aitestgenerator.controllers;

import com.example.aitestgenerator.config.security.service.PrincipalUser;
import com.example.aitestgenerator.dto.activity.TestGenerationActivityDto;
import com.example.aitestgenerator.facades.ActivityFacade;
import com.example.aitestgenerator.notifiets.ActivityNotifier;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;
import java.util.concurrent.TimeUnit;

@RequestMapping("/api/v1/activities")
@RestController
@RequiredArgsConstructor
@Slf4j
public class ActivityController {

    private final ActivityFacade activityFacade;
    private final ActivityNotifier activityNotifier;

    @GetMapping
    public Set<TestGenerationActivityDto> getActivities(final Authentication authentication) {
        final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return activityFacade.getUserActivities(userId);
    }

    @GetMapping("/long-poll")
    public ResponseEntity<Set<TestGenerationActivityDto>> longPoll(final Authentication authentication) {
        final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        try {
            // Ждем до 30 секунд для новых уведомлений
            final long waitTime = 30000;
            final long start = System.currentTimeMillis();
            while (System.currentTimeMillis() - start < waitTime) {
                final Set<TestGenerationActivityDto> activityDtos = activityNotifier.getUserEvents(userId);
                if (CollectionUtils.isNotEmpty(activityDtos)) {
                    log.info("Send set of activities to client. Clean activites...");
                    return ResponseEntity.ok(activityDtos);
                }
                TimeUnit.MILLISECONDS.sleep(3000); // Ждем 3 секунды перед следующей проверкой
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // Восстанавливаем состояние прерывания
        }
        return ResponseEntity.ok(Set.of()); // Если уведомлений нет, возвращаем пустой сет
    }

}
