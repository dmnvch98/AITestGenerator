package com.example.aitestgenerator.facades;

import com.example.aitestgenerator.models.GenerationStatus;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.Text;
import com.example.aitestgenerator.services.TestGeneratingHistoryService;
import com.example.aitestgenerator.services.TestService;
import com.example.aitestgenerator.services.TextService;
import com.example.aitestgenerator.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@RequiredArgsConstructor
public class TestFacade {
    private final TestService testService;
    private final TextService textService;
    private final TestGeneratingHistoryService testGeneratingHistoryService;

    private final UserService userService;

    public Test save(Test test, Long userId) {
        return testService.saveTest(prepareTestToSave(test, userId));
    }

    public Test generateTestAndSave(Long userId, Long textId) {
        Text text = textService.findAllByIdAndUserIdOrThrow(textId, userId);

        TestGeneratingHistory history = TestGeneratingHistory.builder()
            .generationStart(LocalDateTime.now())
            .user(userService.findUserById(userId))
            .text(text)
            .generationStatus(GenerationStatus.WAITING)
            .build();

        testGeneratingHistoryService.save(history);

        Test test = testService.generateTest(text, history);

        return testService.saveTest(prepareTestToSave(test, userId, textId));
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

    private Test prepareTestToSave(Test test, Long userId) {
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
