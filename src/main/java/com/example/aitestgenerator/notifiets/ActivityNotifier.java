package com.example.aitestgenerator.notifiets;

import com.example.aitestgenerator.dto.activity.TestGenerationActivityDto;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class ActivityNotifier {

  private final Map<Long, Set<TestGenerationActivityDto>> userActivities = new ConcurrentHashMap<>();

  public void publishActivity(final Long userId, final TestGenerationActivityDto activity) {
    log.info("Added new activity to the notifier: {} for userId:{}", activity, userId);
    final Set<TestGenerationActivityDto> activities = userActivities.computeIfAbsent(userId, k -> new HashSet<>());

    final Optional<TestGenerationActivityDto> existingActivityOptional = activities
          .stream()
          .filter(a -> a.getUuid().equals(activity.getUuid()))
          .findFirst();

    if (existingActivityOptional.isPresent()) {
      TestGenerationActivityDto existingActivity = existingActivityOptional.get();
      if (existingActivity.getStatus().getPriority() < activity.getStatus().getPriority()) {
        activities.remove(existingActivity);
        activities.add(activity);
      }
    } else {
      activities.add(activity);
    }
  }


  public Set<TestGenerationActivityDto> getUserEvents(final Long userId) {
    final Set<TestGenerationActivityDto> events = userActivities.get(userId);
    if (CollectionUtils.isNotEmpty(events)) {
      final Set<TestGenerationActivityDto> eventsToReturn = new HashSet<>(events);
      userActivities.remove(userId);
      return eventsToReturn;
    }
    return null;
  }


}
