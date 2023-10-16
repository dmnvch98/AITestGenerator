package com.example.aitestgenerator.facades;

import com.example.aitestgenerator.converters.TestConverter;
import com.example.aitestgenerator.dto.tests.GenerateAdditionalTestDto;
import com.example.aitestgenerator.exceptions.AppException;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.models.Text;
import com.example.aitestgenerator.services.TestService;
import com.example.aitestgenerator.services.TextService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TestFacade {
    private final TestService testService;
    private final TextService textService;
    private final TestConverter testConverter;

    public Test save(Test test, Long userId) {
        return testService.saveTest(prepareTestToSave(test, userId));
    }

    public Test generateTestAndSave(Long userId, Long textId) {
        Text text = textService.findAllByIdAndUserIdOrThrow(textId, userId);
        Test test = testService.generateTest(text);
        return testService.saveTest(prepareTestToSave(test, userId, textId));
    }

    public Test generateAdditionalTest(Long userId, Long textId) throws JsonProcessingException {
        List<Test> foundTests = testService.findAllByTextIdAndUserId(textId, userId);

        if (foundTests == null || foundTests.isEmpty()) {
            throw new AppException(String.format("User doesn't have tests for specified text to generate additional test. " +
                "User Id: %d, Text Id: %d", userId, textId), HttpStatus.NOT_FOUND);
        }

        GenerateAdditionalTestDto testDto = testConverter.testToDto(foundTests,
            textService.findAllByIdAndUserIdOrThrow(textId, userId).getTitle());
        Test test = testService.generateAdditionalTest(testDto, textId);
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
