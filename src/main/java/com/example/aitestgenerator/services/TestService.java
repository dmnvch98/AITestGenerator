package com.example.aitestgenerator.services;

import com.example.aitestgenerator.models.Chapter;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.models.User;
import com.example.aitestgenerator.repositories.TestRepository;
import com.fasterxml.jackson.core.JsonProcessingException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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

    public Test generateTest(Chapter chapter, Integer minQuestionNumber, Integer maxQuestionNumber) throws JsonProcessingException {
        log.info("Generating test for chapter. Chapter ID '{}', min question number: {}, max question number: {}", chapter.getId(), minQuestionNumber, maxQuestionNumber);
        return testGenerator.generateTest(chapter, minQuestionNumber, maxQuestionNumber);
    }

    public List<Test> findAllByUser(User user) {
        log.info("Finding all tests for user. User ID: {}", user.getId());
        return testRepository.findAllByUser(user);
    }

    public void deleteTest(Test test) {
        log.info("Deleting test. Test ID: {}", test.getId());
        testRepository.delete(test);
    }

    public Test findTestByIdAndUser(Long testId, User user) {
        log.info("Finding test by ID {} for user. User Id: {}", testId, user.getId());
        return testRepository.findTestByIdAndUser(testId, user);
    }
}
