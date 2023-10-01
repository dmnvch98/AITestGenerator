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

    public Test generateTestAndSave(Long userId, Long textId) throws JsonProcessingException {
        Text text = textService.findAllByIdAndUserIdOrThrow(textId, userId);
        Test test = testService.generateTest(text);
        setUserIdAndTextId(test, userId, text.getId());
        return testService.saveTest(test);
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
        setUserIdAndTextId(test, userId, textId);
        return testService.saveTest(test);
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

    private void setUserIdAndTextId(Test test, Long userId, Long textId) {
        test.setUserId(userId);
        test.setTextId(textId);
    }

}
