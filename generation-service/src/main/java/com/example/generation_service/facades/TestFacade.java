package com.example.generation_service.facades;

import com.example.generation_service.annotations.enumeration.ActionType;
import com.example.generation_service.annotations.useractions.TrackAction;
import com.example.generation_service.converters.TestConverter;
import com.example.generation_service.converters.TestGenerationConverter;
import com.example.generation_service.dto.tests.*;
import com.example.generation_service.models.activity.TestGenerationActivity;
import com.example.generation_service.exceptions.ResourceNotFoundException;
import com.example.generation_service.generators.models.GenerateTestRequest;
import com.example.generation_service.models.*;
import com.example.generation_service.models.files.FileHash;
import com.example.generation_service.models.test.Test;
import com.example.generation_service.models.test.TestGeneratingHistory;
import com.example.generation_service.services.*;
import com.example.generation_service.services.activity.TestGenerationActivityService;
import com.example.generation_service.services.aws.StorageClient;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static com.example.generation_service.utils.Utils.generateRandomCid;

@Component
@RequiredArgsConstructor
@Slf4j
public class TestFacade {

  private final TestService testService;
  private final TestConverter testConverter;
  private final TestGenerationService testGenerationService;
  private final TestGeneratingHistoryService historyService;
  private final CommandService commandService;
  private final FileHashService fileHashService;
  private final StorageClient storageClient;
  private final FileExtractorService extractorService;
  private final TestGenerationConverter testGenerationConverter;
  private final TestGenerationActivityService activityService;

  public Test save(final CreateTestRequestDto request, final Long userId) {
    final Test test = testConverter.convert(request, userId);
    return testService.save(test);
  }

  @TrackAction(ActionType.GENERATE_TEST)
  public void prepareTestGeneration(final Long userId, final GenerateTestRequestDto dto) {
    final String cid = generateRandomCid();
    MDC.put("cid", cid);
    final String hashKey = "generations:user:" + userId;
    log.info("Received command to generation test, command=[{}]", dto);

    try {
      final FileHash fileHash = Optional.ofNullable(dto)
            .map(GenerateTestRequestDto::getHashedFileName)
            .filter(StringUtils::isNotBlank)
            .map(hash -> fileHashService.getByHashedFilenameAndUserId(userId, hash))
            .orElseThrow(() -> new IllegalArgumentException("File cannot be empty"));
      final String hashedFileName = fileHash.getHashedFilename();

      if (!storageClient.doesFileExist(userId, fileHash.getHashedFilename())) {
        log.error("File=[{}] not found for userId=[{}]", hashedFileName, userId);
        throw new ResourceNotFoundException(hashedFileName);
      }

      final GenerateTestMessage message = testGenerationConverter.convert(dto, userId, hashKey, cid);
      commandService.sendCommand(message);
      activityService.createWaitingActivity(fileHash, cid, dto, userId);

    } catch (final Exception e) {
      if (e instanceof IllegalArgumentException || e instanceof ResourceNotFoundException) {
        throw e;
      }
      log.error("An error occurred when queuing test generation. GenerateTestRequestDto=[{}]", dto, e);
      try {
        activityService.failWaitingActivity(hashKey, cid, dto, e);
      } catch (final Exception err) {
        log.error("An error occurred when failing waiting activity", err);
      }
    }
  }

  @Transactional
  public void generateTestReceiveMessage(final GenerateTestMessage message) throws Exception {
      log.info("Received message to generate test. Message=[{}]", message);
      activityService.createInProgressActivity(message.getUserId(), message.getCid(), message.getMessageId());

      final FileHash fileHash = fileHashService
            .getByHashedFilenameAndUserId(message.getUserId(), message.getHashedFileName());
      final String userContent = extractorService.getContentFromFile(fileHash, message.getUserId());
      final GenerateTestRequest request = testGenerationConverter.convert(message, userContent, fileHash);

      final Test test = testGenerationService.generateTest(request, getRetryContextParamsMap(message));
      testService.save(test);

      final TestGenerationActivity currentActivity = activityService.getActivity(message.getHashKey(), message.getCid());
      final TestGeneratingHistory history = testGenerationConverter.getSuccessHistory(currentActivity, test);
      historyService.save(history);
      activityService.finishActivity(currentActivity, test.getId(), test.getTitle(), message.getUserId(), message.getCid());
  }

  @TrackAction(ActionType.DELETE_TEST)
  public void deleteTest(final Long testId, final Long userId) {
    log.debug("Deleting test. Test id: {}, User Id: {}", testId, userId);
    testService.findAllByIdAndUserIdOrThrow(testId, userId);
    testService.deleteTest(testId);
  }

  public TestsResponseDto findUserTests(final Long userId, final String search, int page, int size, String sortBy, String sortDirection) {
    final Page<Test> tests = testService.findUserTests(userId, search, page, size, sortBy, sortDirection);
    return testConverter.convert(tests);
  }

  public Test findTestById(Long testId, Long userId) {
    return testService.findAllByIdAndUserIdOrThrow(testId, userId);
  }

  public Test upsert(final Test test, final Long userId) {
    final Optional<Test> existingTest = testService.findAllByIdAndUserId(test.getId(), userId);

    if (existingTest.isPresent()) {
      final Test updatedTest = updateTestFields(existingTest.get(), test);
      return testService.updateTest(updatedTest, userId);
    } else {
      return testService.insertTest(testConverter.convert(test, userId), userId);
    }
  }

  @TrackAction(ActionType.PRINT_TEST)
  public void trackPrint(final Long testId, final Long userId) {}

  public TestGenHistoryResponseDto findUserHistory(final Long userId, int page, int size, String sortBy, String sortDirection) {
    final Page<TestGeneratingHistory> tests = historyService.findUserHistory(userId, page, size, sortBy, sortDirection);
    return testGenerationConverter.convert(tests);
  }

  private Map<String, String> getRetryContextParamsMap(final GenerateTestMessage message){
    final Map<String, String> retryContextParams = new HashMap<>();
    retryContextParams.put("cid", message.getCid());
    retryContextParams.put("hashKey", message.getHashKey());
    return retryContextParams;
  }

  private Test updateTestFields(final Test existingTest, final Test updateTest) {
    existingTest.setQuestions(updateTest.getQuestions());
    if (!existingTest.getTitle().equals(updateTest.getTitle())) {
      existingTest.setTitle(updateTest.getTitle());
    }
    return existingTest;
  }

}
