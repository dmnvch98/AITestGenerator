package com.example.aitestgenerator.facades;

import com.example.aitestgenerator.converters.TestGenerationConverter;
import com.example.aitestgenerator.dto.tests.GenerateTestRequestDto;
import com.example.aitestgenerator.dto.tests.TextGenerationHistoryDto;
import com.example.aitestgenerator.exceptionHandler.enumaration.GenerationFailReason;
import com.example.aitestgenerator.exceptions.ResourceNotFoundException;
import com.example.aitestgenerator.generators.models.GenerateTestRequest;
import com.example.aitestgenerator.models.*;
import com.example.aitestgenerator.models.enums.GenerationStatus;
import com.example.aitestgenerator.services.*;
import com.example.aitestgenerator.services.aws.StorageClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class TestFacade {

  private final TestService testService;
  private final TestGenerationService testGenerationService;
  private final TestGeneratingHistoryService historyService;
  private final CommandService commandService;
  private final FileHashService fileHashService;
  private final StorageClient storageClient;
  private final FileExtractorService extractorService;
  private final TestGenerationConverter testGenerationConverter;
  private final ActivityService activityService;

  private final UserService userService;

  public Test save(final Test test, final Long userId) {
    return testService.prepareTestAndSave(test, userId);
  }

//  public void generateTestByTextSendMessage(final Long userId, final Long textId) {
//    final Text text = textService.findAllByIdAndUserIdOrThrow(textId, userId);
//
//    final TestGeneratingHistory history = textGenerationHistoryConverter
//        .getWaiting(userService.findUserById(userId));
//
//    historyService.save(history);
//    final GenerateTestMessage message = GenerateTestMessage
//        .builder()
//        .historyId(history.getId())
//        .textId(textId)
//        .userId(userId)
//        .build();
//    commandService.sendCommand(message);
//  }

  public void prepareTestGeneration(final Long userId, final GenerateTestRequestDto dto) {
    final String hashedFileName = dto.getHashedFileName();
    log.info("Retrieved command to generation test by file=[{}], userId=[{}]", hashedFileName, userId);
    final FileHash fileHash = fileHashService.getByHashedFilenameAndUserId(userId, hashedFileName);

    TestGeneratingHistory history = testGenerationConverter.getWaiting(userService.findUserById(userId));

    if (fileHash == null || storageClient.getFileUrl(userId, hashedFileName) == null) {
      log.error("File=[{}] not found for userId=[{}]", hashedFileName, userId);
      activityService.failGeneration(history, GenerationFailReason.FILE_NOT_FOUND);
      throw new ResourceNotFoundException(hashedFileName);
    }

    historyService.save(history);

    final GenerateTestMessage message = testGenerationConverter.convert(dto, hashedFileName, userId, history.getId());
    commandService.sendCommand(message);
  }

  public void generateTestReceiveMessage(final GenerateTestMessage message) {
    TestGeneratingHistory history = historyService.findById(message.getHistoryId());
    final FileHash fileHash = fileHashService.getByHashedFilenameAndUserId(message.getUserId(), message.getHashedFileName());

    if (history != null) {
      history = testGenerationConverter.getInProcess(history, message.getReceipt());
      historyService.save(history);
    } else {
      activityService.failGeneration(message.getReceipt(),
            new ResourceNotFoundException("History not found for test generation: " + message.getHistoryId()));
      return;
    }

    final String userContent = extractorService.getContentFromFile(fileHash, message.getUserId());
    final GenerateTestRequest request = testGenerationConverter.convert(message, history, userContent, message.getUserId(), fileHash);

    final Test test = testGenerationService.generateTest(request);

    testService.prepareTestAndSave(test);

    history = history.toBuilder().test(test).build();
    activityService.finishGeneration(history, message.getReceipt());
  }

  public void deleteTest(final Long testId, final Long userId) {
    log.debug("Deleting test. Test id: {}, User Id: {}", testId, userId);
    testService.findAllByIdAndUserIdOrThrow(testId, userId);
    testService.deleteTest(testId);
  }


  public List<Test> findAllByUser(Long[] testIds, Long userId) {
    return (testIds != null && testIds.length > 0) ?
        testService.findAllByIdInAndUserId(Arrays.asList(testIds), userId) :
        testService.findAllByUserId(userId);
  }

  public Test findTestById(Long testId, Long userId) {
    return testService.findAllByIdAndUserIdOrThrow(testId, userId);
  }

  public Test updateTest(Test updatedTest, Long userId) {
    return testService.updateTest(updatedTest, userId);
  }

  public List<TextGenerationHistoryDto> getTestGenerationHistory(final Long userId, final String status) {
    final List<TestGeneratingHistory> historyDtos = Optional.ofNullable(status)
        .map(GenerationStatus::valueOf)
        .map(s -> historyService.findAllByGenerationStatus(userId, s))
        .orElse(historyService.getAllByUserId(userId));

    return historyDtos
        .stream()
        .map(testGenerationConverter::historyToDto)
        .collect(Collectors.toList());
  }

  public List<TextGenerationHistoryDto> getCurrentHistories(final Long userId) {
    return historyService.findAllByUserIdAndGenerationStatusIn(userId, List.of(GenerationStatus.WAITING, GenerationStatus.IN_PROCESS))
        .stream()
        .map(testGenerationConverter::historyToDto)
        .collect(Collectors.toList());
  }

}
