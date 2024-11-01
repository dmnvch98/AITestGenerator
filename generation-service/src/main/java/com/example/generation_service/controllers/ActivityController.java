package com.example.generation_service.controllers;

import com.example.generation_service.config.security.service.PrincipalUser;
import com.example.generation_service.dto.activity.BulkActivityDeleteDto;
import com.example.generation_service.dto.activity.TestGenerationActivityResponseDto;
import com.example.generation_service.dto.activity.TestGenerationActivityRequestDto;
import com.example.generation_service.facades.ActivityFacade;
import com.example.generation_service.models.activity.TestGenerationActivity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@RequestMapping("/api/v1/activities")
@RestController
@RequiredArgsConstructor
@Slf4j
public class ActivityController {

    private final ActivityFacade activityFacade;

    @PostMapping
    public void saveActivity(final Authentication authentication, @RequestBody final TestGenerationActivityRequestDto dto) {
        final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        activityFacade.save(dto, userId);
    }

    @GetMapping
    public Set<TestGenerationActivityResponseDto> getActivities(final Authentication authentication) {
        final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return activityFacade.getUserActivities(userId);
    }

    @DeleteMapping("/{cid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUserActivities(final Authentication authentication, @PathVariable final String cid) {
        final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        activityFacade.deleteActivity(userId, cid);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void userActivitiesBulkDelete(final Authentication authentication, @RequestBody final BulkActivityDeleteDto dto) {
        final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        activityFacade.deleteUserActivities(userId, dto.getCids());
    }

    @GetMapping("/all")
    public List<TestGenerationActivity> getAllActivities() {
      return activityFacade.getAllObjectsFromHashes();
    }

    @GetMapping("/long-poll")
    public ResponseEntity<Set<TestGenerationActivityResponseDto>> longPoll(final Authentication authentication) {
        final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        try {
            final long initialWaitTime = 30000;
            final long reducedWaitTime = 10000;
            long currentWaitTime = initialWaitTime;

            final long start = System.currentTimeMillis();

            while (System.currentTimeMillis() - start < currentWaitTime) {
                TimeUnit.MILLISECONDS.sleep(5000);

                final Set<TestGenerationActivityResponseDto> activityDtos = activityFacade.getUserActivities(userId);

                if (CollectionUtils.isNotEmpty(activityDtos)) {
                    return ResponseEntity.ok(activityDtos);
                }

                currentWaitTime = reducedWaitTime;
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Если уведомлений нет, возвращаем пустой сет
        return ResponseEntity.ok(Set.of());
    }



}
