package com.example.aitestgenerator.facades;

import com.example.aitestgenerator.exceptions.ResourceNotFoundException;
import com.example.aitestgenerator.extractors.FileExtractorFabric;
import com.example.aitestgenerator.generators.models.GenerateTestRequest;
import com.example.aitestgenerator.holder.TestGeneratingHistoryHolder;
import com.example.aitestgenerator.models.*;
import com.example.aitestgenerator.models.enums.GenerationStatus;
import com.example.aitestgenerator.services.*;
import com.example.aitestgenerator.services.aws.StorageClient;
import com.example.aitestgenerator.utils.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.net.URL;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class TestFacade {

    private final TestService testService;
    private final TestGenerationService testGenerationService;
    private final TextService textService;
    private final TestGeneratingHistoryService historyService;
    private final TestGeneratingHistoryHolder historyHolder;
    private final CommandService commandService;
    private final FileHashService fileHashService;
    private final StorageClient storageClient;
    private final FileExtractorFabric fileExtractorFabric;

    private final UserService userService;

    public Test save(Test test, Long userId) {
        return testService.saveTest(prepareTestToSave(test, userId));
    }

    public void generateTestByTextSendMessage(final Long userId, final Long textId) {
        final Text text = textService.findAllByIdAndUserIdOrThrow(textId, userId);

        final TestGeneratingHistory history = TestGeneratingHistory.builder()
            .generationStart(LocalDateTime.now())
            .user(userService.findUserById(userId))
            .generationStatus(GenerationStatus.WAITING)
            .text(text)
            .build();

        historyService.save(history);
        final GenerateTestMessage message = GenerateTestMessage
            .builder()
            .historyId(history.getId())
            .textId(textId)
            .userId(userId)
            .build();
       commandService.sendCommand(message);
    }

    public void generateTestByFileSendMessage(final Long userId, final String hashedFileName) {
        final FileHash fileHash = fileHashService.getByHashedFilenameAndUserId(userId, hashedFileName);

        if (fileHash == null) {
            throw new ResourceNotFoundException(hashedFileName, userId);
        }
        final TestGeneratingHistory history = TestGeneratingHistory.builder()
                .generationStart(LocalDateTime.now())
                .user(userService.findUserById(userId))
                .generationStatus(GenerationStatus.WAITING)
                .fileHash(fileHash)
                .build();

        historyService.save(history);
        final GenerateTestMessage message = GenerateTestMessage
                .builder()
                .historyId(history.getId())
                .hashedFileName(hashedFileName)
                .userId(userId)
                .build();
        commandService.sendCommand(message);
    }

    public void generateTestReceiveMessage(final GenerateTestMessage message) {
        final TestGeneratingHistory history = historyService.findByIdAndUserId(message.getHistoryId());
        history.setGenerationStatus(GenerationStatus.IN_PROCESS);
        historyService.save(history);
        historyHolder.setHistory(history);

        final GenerateTestRequest request = GenerateTestRequest.builder()
                .content(getContent(history))
                .messages(new ArrayList<>())
                .history(history)
                .build();

        final Test test = testGenerationService.generateTest(request);

        testService.saveTest(prepareTestToSave(test, message.getUserId(), message.getTextId()));
        commandService.deleteMessage(message.getReceipt());
        history.setTest(test);
        historyService.save(history);
    }

    public void deleteTest(Long testId, Long userId) {
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
        return testService.update(updatedTest, userId);
    }

    private Test prepareTestToSave(final Test test, final Long userId) {
        test.getQuestions().forEach(question -> {
            question.setTest(test);
            question
                .getAnswerOptions()
                .forEach(answerOption -> answerOption.setQuestion(question));
        });
        test.setUserId(userId);
        return test;
    }

    private Test prepareTestToSave(Test test, Long userId, Long textId) {
        prepareTestToSave(test, userId);
        test.setTextId(textId);
        return test;
    }

    private String getContent(final TestGeneratingHistory history) {
        return Optional.ofNullable(getContentFromText(history))
                .orElseGet(() -> getContentFromFile(history));
    }

    private String getContentFromText(final TestGeneratingHistory history) {
        return Optional.ofNullable(history.getText())
                .map(Text::getContent)
                .orElse(null);
    }

    private String getContentFromFile(final TestGeneratingHistory history) {
        final FileHash fileHash = history.getFileHash();
        final String originalFileName = Utils.getFileExtension(fileHash.getOriginalFilename());
        final URL fileUrl = storageClient.getFileUrl(history.getUser().getId(), fileHash.getHashedFilename());
        return fileExtractorFabric.getFileExtractor(originalFileName)
                .extract(fileUrl);
    }
}
