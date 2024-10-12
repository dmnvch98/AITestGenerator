package com.example.aitestgenerator.facades;

import com.example.aitestgenerator.converters.ActivityConverter;
import com.example.aitestgenerator.dto.activity.TestGenerationActivityDto;
import com.example.aitestgenerator.models.TestGenerationActivity;
import com.example.aitestgenerator.services.ActivityService;
import com.example.aitestgenerator.utils.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class ActivityFacade {

  private final ActivityService activityService;
  private final ActivityConverter activityConverter;

  public Set<TestGenerationActivityDto> getUserActivities(final Long userId) {
    final String hashKey = Utils.getHashKey(userId);
    final Set<TestGenerationActivity> activities = activityService.getUserActivities(hashKey);
    return activityConverter.convert(activities);
  }
}
