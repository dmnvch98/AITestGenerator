package com.example.aitestgenerator.facades;

import com.example.aitestgenerator.converters.ActivityConverter;
import com.example.aitestgenerator.dto.activity.TestGenerationActivityDto;
import com.example.aitestgenerator.models.TestGenerationActivity;
import com.example.aitestgenerator.services.ActivityService;
import com.example.aitestgenerator.utils.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class ActivityFacade {

  private final ActivityService activityService;
  private final ActivityConverter activityConverter;

  public void save(final TestGenerationActivityDto dto, final Long userId) {
    activityService.saveActivity(activityConverter.convert(dto, userId));
  }

  public Set<TestGenerationActivityDto> getUserActivities(final Long userId) {
    final String hashKey = Utils.getHashKey(userId);
    final Set<TestGenerationActivity> activities = activityService.getUserActivities(hashKey);
    return activityConverter.convert(activities);
  }

  public void deleteActivity(final Long userId, final String cid) {
    activityService.deleteUserActivity(userId, cid);
  }

  public void deleteUserActivities(final Long userId, final List<String> cids) {
    activityService.deleteUserActivities(userId, cids);
  }
}
