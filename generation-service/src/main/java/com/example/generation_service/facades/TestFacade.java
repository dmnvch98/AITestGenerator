package com.example.generation_service.facades;

import com.example.generation_service.converters.TestConverter;
import com.example.generation_service.converters.TestGenerationConverter;
import com.example.generation_service.models.TestGenerationActivity;
import com.example.generation_service.dto.tests.CreateTestRequestDto;
import com.example.generation_service.dto.tests.GenerateTestRequestDto;
import com.example.generation_service.dto.tests.TestsResponseDto;
import com.example.generation_service.dto.tests.TextGenerationHistoryDto;
import com.example.generation_service.exceptions.ResourceNotFoundException;
import com.example.generation_service.generators.models.GenerateTestRequest;
import com.example.generation_service.models.*;
import com.example.generation_service.models.enums.ActivityStatus;
import com.example.generation_service.services.*;
import com.example.generation_service.services.aws.StorageClient;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

import static com.example.generation_service.utils.Utils.generateCid;

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
  private final ActivityService activityService;

  public Test save(final CreateTestRequestDto request, final Long userId) {
    final Test test = testConverter.convert(request, userId);
    return testService.save(test);
  }

  public void prepareTestGeneration(final Long userId, final GenerateTestRequestDto dto) {
    final String cid = generateCid();
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

      activityService.createWaitingActivity(fileHash, cid, dto, userId);

      final GenerateTestMessage message = testGenerationConverter.convert(dto, userId, hashKey, cid);
      commandService.sendCommand(message);
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

  public void generateTestReceiveMessage(final GenerateTestMessage message) {
      log.info("Received message to generate test. Message=[{}]", message);
      activityService.createInProgressActivity(message.getUserId(), message.getCid(), message.getReceipt());

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

  public void deleteTest(final Long testId, final Long userId) {
    log.debug("Deleting test. Test id: {}, User Id: {}", testId, userId);
    testService.findAllByIdAndUserIdOrThrow(testId, userId);
    testService.deleteTest(testId);
  }


  public TestsResponseDto findAllByUser(final Long[] testIds, final Long userId) {
    List<Test> tests;
    if (testIds != null && testIds.length > 0) {
      tests = testService.findAllByIdInAndUserId(Arrays.asList(testIds), userId);
    } else {
      tests = testService.findAllByUserId(userId);
    }

    return testConverter.convert(tests);
  }

  public Test findTestById(Long testId, Long userId) {
    return testService.findAllByIdAndUserIdOrThrow(testId, userId);
  }

  public Test upsert(final Test test, final Long userId) {
    return testService.upsert(test, userId);
  }

  public List<TextGenerationHistoryDto> getTestGenerationHistory(final Long userId, final String status) {
    final List<TestGeneratingHistory> historyDtos = Optional.ofNullable(status)
        .map(ActivityStatus::valueOf)
        .map(s -> historyService.findAllByGenerationStatus(userId, s))
        .orElse(historyService.getAllByUserId(userId));

    return historyDtos
        .stream()
        .map(testGenerationConverter::historyToDto)
        .collect(Collectors.toList());
  }

  public List<TextGenerationHistoryDto> getCurrentHistories(final Long userId) {
    return historyService.findAllByUserIdAndGenerationStatusIn(userId, List.of(ActivityStatus.WAITING, ActivityStatus.IN_PROCESS))
        .stream()
        .map(testGenerationConverter::historyToDto)
        .collect(Collectors.toList());
  }

  private Map<String, String> getRetryContextParamsMap(final GenerateTestMessage message){
    final Map<String, String> retryContextParams = new HashMap<>();
    retryContextParams.put("cid", message.getCid());
    retryContextParams.put("hashKey", message.getHashKey());
    return retryContextParams;
  }

}
