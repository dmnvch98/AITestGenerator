package com.example.aitestgenerator.services;

import com.example.aitestgenerator.config.redis.RedisService;
import com.example.aitestgenerator.converters.ActivityConverter;
import com.example.aitestgenerator.converters.TestGenerationConverter;
import com.example.aitestgenerator.models.TestGenerationActivity;
import com.example.aitestgenerator.dto.tests.GenerateTestRequestDto;
import com.example.aitestgenerator.exceptionHandler.enumaration.GenerationFailReason;
import com.example.aitestgenerator.models.FileHash;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.utils.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final CommandService commandService;
    private final ActivityConverter activityConverter;
    private final TestGenerationConverter historyConverter;
    private final RedisService<TestGenerationActivity> redisService;
    private final TestGeneratingHistoryService historyService;

    public void saveActivity(final TestGenerationActivity activity) {
        redisService.saveUserActivity(activity.getUserId(), activity.getCid(), activity);
    }

    public TestGenerationActivity getActivity(final String hashKey, final String cid) {
        return redisService.getUserActivity(hashKey, cid, TestGenerationActivity.class);
    }

    public Set<TestGenerationActivity> getUserActivities(final String hashKey) {
        return redisService.getUserActivities(hashKey, TestGenerationActivity.class);
    }

    public void createWaitingActivity(final FileHash fileHash, final String cid,
                                      final GenerateTestRequestDto requestDto, final Long userId) {
        final TestGenerationActivity waitingActivity = activityConverter.getWaitingActivity(cid, requestDto, fileHash.getOriginalFilename(), userId);
        redisService.saveUserActivity(userId, cid, waitingActivity);
    }

    public void createInProgressActivity(final Long userId, final String cid, final String messageReceipt) {
        final String hashKey = Utils.getHashKey(userId);
        final TestGenerationActivity currentActivity = redisService
              .getUserActivity(hashKey, cid, TestGenerationActivity.class);
        final TestGenerationActivity inProcessActivity = activityConverter
              .getInProgressActivity(currentActivity, messageReceipt);
        redisService.saveUserActivity(userId, inProcessActivity.getCid(), inProcessActivity);
    }

    private void createFinishedActivity(final TestGenerationActivity activity) {
        final TestGenerationActivity finishedActivity = activityConverter.getFinishedActivity(activity);
        redisService.saveUserActivity(activity.getUserId(), activity.getCid(), finishedActivity);
    }

    public void deleteUserActivity(final Long userId, final String cid) {
        redisService.deleteUserActivity(userId, cid);
    }

    public void deleteUserActivities(final Long userId, final List<String> cids) {
        redisService.deleteUserActivities(userId, cids);
    }

    public void finishActivity(final String messageReceipt, final Long userId, final String cid) {
        final String hashKey = Utils.getHashKey(userId);
        final TestGenerationActivity currentActivity = redisService
              .getUserActivity(hashKey, cid, TestGenerationActivity.class);

        createFinishedActivity(currentActivity);
        commandService.deleteMessage(messageReceipt);
    }

    public void failActivity(final String hashKey, final String cid, final GenerationFailReason failReason) {
        final TestGenerationActivity activity = redisService.getUserActivity(hashKey, cid, TestGenerationActivity.class);
        final Long userId = Utils.getUserIdFromHashKey(hashKey);

        if (activity != null) {
            final TestGeneratingHistory failedHistory = historyConverter.getFailedHistory(activity, failReason);
            historyService.save(failedHistory);
            final String receipt = activity.getMessageReceipt();

            if (receipt != null) {
                commandService.deleteMessage(receipt);
            }
        }

        redisService.deleteUserActivity(userId, cid);

    }

    public void failActivity(final String hashKey, final String cid, final Throwable cause) {
        final GenerationFailReason failReason = GenerationFailReason.extractFailureCode(cause);
        failActivity(hashKey, cid, failReason);
    }

    public void failActivityIfFatal(final String hashKey, final String cid, final Throwable cause) {
        final GenerationFailReason failReason = GenerationFailReason.extractFailureCode(cause);
        if (failReason.isFatal()) {
            failActivity(hashKey, cid, failReason);
        }
    }

    public void failAllActivities(final GenerationFailReason failReason) {
        final List<TestGenerationActivity> activities = redisService.getAllObjectsFromHashes(TestGenerationActivity.class);
        log.warn("Force closing activities, activities size:=[{}]", activities.size());

        commandService.purgeQueue();
        redisService.deleteAllKeys();

        final List<TestGeneratingHistory> testGeneratingHistories = activities.stream()
           .map(activity -> historyConverter.getFailedHistory(activity, failReason))
           .toList();

        historyService.save(testGeneratingHistories);
    }

}
