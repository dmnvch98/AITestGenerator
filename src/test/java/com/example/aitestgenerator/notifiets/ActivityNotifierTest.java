package com.example.aitestgenerator.notifiets;

import com.example.aitestgenerator.dto.activity.TestGenerationActivityDto;
import com.example.aitestgenerator.models.enums.ActivityStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ActivityNotifierTest {

  private ActivityNotifier activityNotifier;
  private final static UUID UUID_CONST = UUID.randomUUID();

  @BeforeEach
  void setUp() {
    activityNotifier = new ActivityNotifier();
  }

  @Test
  void publishActivity_shouldAddNewActivityIfNoExisting() {
    final Long userId = 1L;
    final TestGenerationActivityDto activity = TestGenerationActivityDto
          .builder()
          .uuid(UUID_CONST)
          .status(ActivityStatus.WAITING)
          .build();

    activityNotifier.publishActivity(userId, activity);

    Set<TestGenerationActivityDto> activities = activityNotifier.getUserEvents(userId);
    assertEquals(1, activities.size());
    assertTrue(activities.contains(activity));
  }

  @Test
  void publishActivity_shouldReplaceActivityIfHigherPriority() {
    Long userId = 1L;
    TestGenerationActivityDto oldActivity = TestGenerationActivityDto
          .builder()
          .uuid(UUID_CONST)
          .status(ActivityStatus.WAITING)
          .build();
    TestGenerationActivityDto newActivity = TestGenerationActivityDto
          .builder()
          .uuid(UUID_CONST)
          .status(ActivityStatus.IN_PROCESS)
          .build();

    // Добавляем старую активность
    activityNotifier.publishActivity(userId, oldActivity);

    // Добавляем новую активность с более высоким приоритетом
    activityNotifier.publishActivity(userId, newActivity);

    // Проверяем, что старая активность заменена новой
    Set<TestGenerationActivityDto> activities = activityNotifier.getUserEvents(userId);
    assertEquals(1, activities.size());
    assertTrue(activities.contains(newActivity));
  }

  @Test
  void publishActivity_shouldNotReplaceActivityIfLowerPriority() {
    Long userId = 1L;
    TestGenerationActivityDto oldActivity = TestGenerationActivityDto
          .builder()
          .uuid(UUID_CONST)
          .status(ActivityStatus.SUCCESS)
          .build();
    TestGenerationActivityDto newActivity = TestGenerationActivityDto
          .builder()
          .uuid(UUID_CONST)
          .status(ActivityStatus.IN_PROCESS)
          .build();

    // Добавляем старую активность
    activityNotifier.publishActivity(userId, oldActivity);

    // Добавляем новую активность с более низким приоритетом
    activityNotifier.publishActivity(userId, newActivity);

    // Проверяем, что старая активность не была заменена
    Set<TestGenerationActivityDto> activities = activityNotifier.getUserEvents(userId);
    assertEquals(1, activities.size());
    assertTrue(activities.contains(oldActivity));
  }
}
