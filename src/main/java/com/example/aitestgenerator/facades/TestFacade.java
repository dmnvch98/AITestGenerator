package com.example.aitestgenerator.facades;

import com.example.aitestgenerator.dto.tests.GenerateTestRequestDto;
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

    public Test generateTestAndSave(Long userId, GenerateTestRequestDto dto) throws JsonProcessingException {
        Text text = textService.findAllByIdAndUserIdOrThrow(dto.getTextId(), userId);
        Test test = testService.generateTest(text, dto.getMinQuestionNumber(), dto.getMaxQuestionNumber());
        test.setUserId(userId);
        test.setTextId(text.getId());
        return testService.saveTest(test);
    }

    public void deleteTest(Long testId, Long userId) {
        Test test = testService.findAllByIdAndUserIdOrThrow(testId, userId);
        if (test != null) {
            testService.deleteTest(test);
        } else {
            throw new AppException("Test not found", HttpStatus.NOT_FOUND);
        }
    }

    public List<Test> findAllByUser(Long[] testIds, Long userId) {
        if (testIds != null && testIds.length > 0) {
            return testService
                .findAllByIdInAndUserId(Arrays.asList(testIds), userId);

        }
        return testService.findAllByUserId(userId);
    }


    public Test findTestById(Long testId, Long userId) {
        return testService.findAllByIdAndUserIdOrThrow(testId, userId);
    }

    public Test updateTest(Test updatedTest, Long userId) {
        return testService.update(updatedTest, userId);
    }
}
