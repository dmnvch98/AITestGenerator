package com.example.generation_service.facades;

import com.example.generation_service.converters.ActivityConverter;
import com.example.generation_service.dto.activity.TestGenerationActivityResponseDto;
import com.example.generation_service.dto.activity.TestGenerationActivityRequestDto;
import com.example.generation_service.models.activity.TestGenerationActivity;
import com.example.generation_service.services.activity.TestGenerationActivityService;
import com.example.generation_service.utils.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class ActivityFacade {

  private final TestGenerationActivityService activityService;
  private final ActivityConverter activityConverter;

  public void save(final TestGenerationActivityRequestDto dto, final Long userId) {
    activityService.saveActivity(activityConverter.convert(dto, userId));
  }

  public Set<TestGenerationActivityResponseDto> getUserActivities(final Long userId) {
    final String hashKey = Utils.getGenerationHashKey(userId);
    final Set<TestGenerationActivity> activities = activityService.getUserActivities(hashKey);
    return activityConverter.convert(activities);
  }

  public void deleteActivity(final Long userId, final String cid) {
    activityService.deleteUserActivity(userId, cid);
  }

  public void deleteUserActivities(final Long userId, final List<String> cids) {
    activityService.deleteUserActivities(userId, cids);
  }

  public List<TestGenerationActivity> getAllObjectsFromHashes() {
    return activityService.getAllObjectsFromHashes();
  }
}
