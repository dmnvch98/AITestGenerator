package com.example.aitestgenerator.services;

import com.example.aitestgenerator.exceptions.AppException;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.models.Text;
import com.example.aitestgenerator.repositories.TestRepository;
import com.fasterxml.jackson.core.JsonProcessingException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestService {
    private final TestRepository testRepository;
    private final TestGenerator testGenerator;

    public Test saveTest(Test test) {
        log.info("Saving test. Test title: {}", test.getTitle());
        return testRepository.save(test);
    }

    public Test generateTest(Text text, Integer minQuestionNumber, Integer maxQuestionNumber) throws JsonProcessingException {
        log.info("Generating test for chapter. Chapter ID '{}', min question number: {}, max question number: {}", text.getId(), minQuestionNumber, maxQuestionNumber);
        return testGenerator.generateTest(text, minQuestionNumber, maxQuestionNumber);
    }

    public List<Test> findAllByUserId(Long userId) {
        log.info("Finding all tests for user. User ID: {}", userId);
        return testRepository.findAllByUserId(userId);
    }

    public void deleteTest(Test test) {
        log.info("Deleting test. Test ID: {}", test.getId());
        testRepository.delete(test);
    }

    public Test findTestByIdAndUserId(Long testId, Long userId) {
        log.info("Finding test by ID {} for user. User Id: {}", testId, userId);
        return testRepository.findTestByIdAndUserId(testId, userId)
            .orElseThrow(() -> new AppException(
                String.format("Test with Id %d not found for user with id: %d", testId, userId), HttpStatus.NOT_FOUND));
    }
}
