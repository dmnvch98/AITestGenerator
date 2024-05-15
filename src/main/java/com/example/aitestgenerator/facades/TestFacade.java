package com.example.aitestgenerator.facades;

import com.example.aitestgenerator.holder.TestGeneratingHistoryHolder;
import com.example.aitestgenerator.models.GenerateTestMessage;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.Text;
import com.example.aitestgenerator.models.enums.GenerationStatus;
import com.example.aitestgenerator.services.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TestFacade {

    private final TestService testService;
    private final TestGenerationService testGenerationService;
    private final TextService textService;
    private final TestGeneratingHistoryService historyService;
    private final TestGeneratingHistoryHolder historyHolder;
    private final CommandService commandService;

    private final UserService userService;

    public Test save(Test test, Long userId) {
        return testService.saveTest(prepareTestToSave(test, userId));
    }

    public void generateTestSendMessage(final Long userId, final Long textId) {
        Text text = textService.findAllByIdAndUserIdOrThrow(textId, userId);

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

    public void generateTestReceiveMessage(final GenerateTestMessage message) {
        TestGeneratingHistory history = historyService.findByIdAndUserId(message.getHistoryId());
        history.setGenerationStatus(GenerationStatus.IN_PROCESS);
        historyService.save(history);
        historyHolder.setHistory(history);

        final Test test = testGenerationService.generateTest(history);

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
}
