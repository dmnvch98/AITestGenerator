package com.example.generation_service.services.activity;

import com.example.generation_service.converters.ActivityConverter;
import com.example.generation_service.converters.TestGenerationConverter;
import com.example.generation_service.dto.sse.NotificationType;
import com.example.generation_service.models.activity.TestGenerationActivity;
import com.example.generation_service.dto.tests.GenerateTestRequestDto;
import com.example.generation_service.exceptionHandler.enumaration.GenerationFailReason;
import com.example.generation_service.models.files.FileMetadata;
import com.example.generation_service.models.generation.QuestionType;
import com.example.generation_service.models.test.TestGeneratingHistory;
import com.example.generation_service.services.CommandService;
import com.example.generation_service.services.FileMetadataService;
import com.example.generation_service.services.TestGeneratingHistoryService;
import com.example.generation_service.services.notification.NotificationService;
import com.example.generation_service.services.redis.RedisService;
import com.example.generation_service.utils.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestGenerationActivityService {

    public static final String GENERATION_ACTIVITIES_COUNTER_NAME = "generations_number";

    private final CommandService commandService;
    private final ActivityConverter activityConverter;
    private final TestGenerationConverter historyConverter;
    private final RedisService genericRedisService;
    private final TestGeneratingHistoryService historyService;
    private final FileMetadataService fileHashService;
    private final NotificationService notificationService;

    public void saveActivity(final TestGenerationActivity activity) {
        final String hashKey = Utils.getGenerationHashKey(activity.getUserId());
        genericRedisService.saveObjectToHash(hashKey, activity.getCid(), activity, GENERATION_ACTIVITIES_COUNTER_NAME);
        notificationService.sendNotificationToUser(activity.getUserId(), NotificationType.ACTIVITY);
    }

    public TestGenerationActivity getActivity(final String hashKey, final String cid) {
        return genericRedisService.getObjectFromHash(hashKey, cid, TestGenerationActivity.class)
              .orElse(null);
    }

    public Set<TestGenerationActivity> getUserActivities(final String hashKey) {
        return genericRedisService.getAllObjectsFromHash(hashKey, TestGenerationActivity.class);
    }

    public void createWaitingActivity(final FileMetadata fileHash, final String cid,
                                      final GenerateTestRequestDto requestDto, final Long userId, final Set<QuestionType> queuedQuestionTypes) {
        final TestGenerationActivity waitingActivity = activityConverter.getWaitingActivity(cid, requestDto, fileHash.getOriginalFilename(), userId, queuedQuestionTypes);
        final String hashKey = Utils.getGenerationHashKey(userId);
        genericRedisService.saveObjectToHash(hashKey, cid, waitingActivity, GENERATION_ACTIVITIES_COUNTER_NAME);
        notificationService.sendNotificationToUser(userId, NotificationType.ACTIVITY);
    }

    public void updateProcessedQuestionType(final TestGenerationActivity activity, final QuestionType questionType) {
        final TestGenerationActivity updatedActivity = activityConverter.updateProcessedQuestionType(activity, questionType);
        final String hashKey = Utils.getGenerationHashKey(activity.getUserId());
        genericRedisService.saveObjectToHash(hashKey, activity.getCid(), updatedActivity, GENERATION_ACTIVITIES_COUNTER_NAME);
        notificationService.sendNotificationToUser(activity.getUserId(), NotificationType.ACTIVITY);
    }

    public void createInProgressActivity(final Long userId, final String cid, final String messageReceipt) {
        final String hashKey = Utils.getGenerationHashKey(userId);
        final TestGenerationActivity currentActivity = genericRedisService
              .getObjectFromHash(hashKey, cid, TestGenerationActivity.class)
              .orElseGet(() -> TestGenerationActivity.builder()
                      .userId(userId)
                      .cid(cid)
                      .messageReceipt(messageReceipt)
                      .build()
              );
        final TestGenerationActivity inProcessActivity = activityConverter
              .getInProgressActivity(currentActivity, messageReceipt);
        genericRedisService.saveObjectToHash(hashKey,cid, inProcessActivity, GENERATION_ACTIVITIES_COUNTER_NAME);
        notificationService.sendNotificationToUser(userId, NotificationType.ACTIVITY);
    }

    private void createFinishedActivity(final TestGenerationActivity activity, final Long testId,
                                        final String testTitle, final Long userId, final String cid) {
        final TestGenerationActivity finishedActivity = activityConverter.getFinishedActivity(activity, testId, testTitle);
        final String hashKey = Utils.getGenerationHashKey(userId);
        if (finishedActivity != null) {
            genericRedisService.saveObjectToHash(hashKey, cid, finishedActivity, GENERATION_ACTIVITIES_COUNTER_NAME);
        }
        notificationService.sendNotificationToUser(userId, NotificationType.ACTIVITY);
    }

    public void deleteUserActivity(final Long userId, final String cid) {
        final String hashKey = Utils.getGenerationHashKey(userId);
        genericRedisService.deleteObjectFromHash(hashKey, cid, GENERATION_ACTIVITIES_COUNTER_NAME);
        notificationService.sendNotificationToUser(userId, NotificationType.ACTIVITY);
    }

    public void deleteUserActivities(final Long userId, final List<String> cids) {
        final String hashKey = Utils.getGenerationHashKey(userId);
        genericRedisService.deleteObjectsFromHash(hashKey, cids, GENERATION_ACTIVITIES_COUNTER_NAME);
        notificationService.sendNotificationToUser(userId, NotificationType.ACTIVITY);
    }

    public void finishActivity(final TestGenerationActivity activity, final Long testId, final String testTitle,
                               final Long userId, final String cid) {
        createFinishedActivity(activity, testId, testTitle, userId, cid);
    }

    public void failActivity(final String hashKey, final String cid, final GenerationFailReason failReason) {
        genericRedisService.getObjectFromHash(hashKey, cid, TestGenerationActivity.class)
              .ifPresent(activity -> failActivity(activity, failReason));
    }

    private void failActivity(final TestGenerationActivity activity, final GenerationFailReason failReason) {
        log.info("Failing activity=[{}]", activity);
        final TestGenerationActivity failedActivity = activityConverter.getFailedActivity(activity, failReason);
        final String hashKey = Utils.getGenerationHashKey(activity.getUserId());
        genericRedisService.saveObjectToHash(hashKey, failedActivity.getCid(), failedActivity, GENERATION_ACTIVITIES_COUNTER_NAME);
        log.info("Saved failed activity=[{}]", failedActivity);
        final TestGeneratingHistory failedHistory = historyConverter.getFailedHistory(activity, failReason);
        historyService.save(failedHistory);
        notificationService.sendNotificationToUser(activity.getUserId(), NotificationType.ACTIVITY);
    }

    public void failActivity(final String hashKey, final String cid, final Throwable cause) {
        final GenerationFailReason failReason = GenerationFailReason.extractFailureCode(cause);
        failActivity(hashKey, cid, failReason);
    }

    public void failWaitingActivity(final String hashKey, final String cid, final GenerateTestRequestDto dto, final Throwable cause) {
        final GenerationFailReason failReason = GenerationFailReason.extractFailureCode(cause);
        final Optional<TestGenerationActivity> waitingActivity = genericRedisService.getObjectFromHash(hashKey, cid, TestGenerationActivity.class);
        if (waitingActivity.isPresent()) {
            failActivity(waitingActivity.get(), failReason);
        } else {
            final Long userId = Utils.getUserIdFromHashKey(hashKey);
            final String originalFileName = Optional.ofNullable(dto)
                  .map(GenerateTestRequestDto::getHashedFileName)
                  .map(h -> fileHashService.getByHashedFilenameAndUserId(userId, h))
                  .map(FileMetadata::getOriginalFilename)
                  .orElse(null);

            final TestGeneratingHistory failedHistory = historyConverter.getFailedHistoryWhenNoActivity(dto, userId,
                  failReason, cid, originalFileName);
            final TestGenerationActivity failedActivity = activityConverter
                  .getFailedWaitingActivity(cid, originalFileName, failReason);
            genericRedisService.saveObjectToHash(hashKey, cid, failedActivity, GENERATION_ACTIVITIES_COUNTER_NAME);
            historyService.save(failedHistory);
            notificationService.sendNotificationToUser(userId, NotificationType.ACTIVITY);
        }
    }

    public void failActivityIfFatal(final String hashKey, final String cid, final Throwable cause) {
        final GenerationFailReason failReason = GenerationFailReason.extractFailureCode(cause);
        if (failReason.isFatal()) {
            failActivity(hashKey, cid, failReason);
        }
    }

    public void failAllActivities(final GenerationFailReason failReason) {
        final List<TestGenerationActivity> activities = genericRedisService.getAllObjectsFromHashes(TestGenerationActivity.class);
        log.warn("Force closing activities, activities size:=[{}]", activities.size());

        commandService.purgeQueue();
        genericRedisService.deleteAllKeysFromHash();

        final List<TestGeneratingHistory> testGeneratingHistories = activities.stream()
           .map(activity -> historyConverter.getFailedHistory(activity, failReason))
           .toList();

        historyService.save(testGeneratingHistories);
    }

    public List<TestGenerationActivity> getAllObjectsFromHashes() {
        return genericRedisService.getAllObjectsFromHashes(TestGenerationActivity.class);
    }

    public Long getAllActivitiesCount() {
        return genericRedisService.getKeyCount(GENERATION_ACTIVITIES_COUNTER_NAME);
    }

}
