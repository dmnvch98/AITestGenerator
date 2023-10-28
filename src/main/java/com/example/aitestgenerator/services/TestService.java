package com.example.aitestgenerator.services;

import com.example.aitestgenerator.exceptions.AppException;
import com.example.aitestgenerator.models.*;
import com.example.aitestgenerator.repositories.TestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestService {
    private final TestRepository testRepository;
    private final TestGenerator testGenerator;

    public Test saveTest(Test test) {
        log.info("Saving test. Test title: {}. Text id: {}, User id: {} ", test.getTitle(), test.getTextId(), test.getUserId());
        return testRepository.save(test);
    }

    public Test generateTest(Text text, TestGeneratingHistory history) {
        log.info("Generating test for text. Text ID '{}'", text.getId());
        return testGenerator.start(text, history);
    }

    public List<Test> findAllByUserId(Long userId) {
        log.info("Finding all tests for user. User ID: {}", userId);
        return testRepository.findAllByUserId(userId);
    }

    public void deleteTest(Long testId) {
        log.info("Deleting test. Test ID: {}", testId);
        testRepository.deleteTestById(testId);
    }

    public Test findAllByIdAndUserIdOrThrow(Long testId, Long userId) {
        log.info("Finding test by ID {} for user. User Id: {}", testId, userId);
        return testRepository.findTestByIdAndUserId(testId, userId)
            .orElseThrow(() -> new AppException(
                String.format("Test with Id %d not found for user with id: %d", testId, userId), HttpStatus.NOT_FOUND));
    }

    public List<Test> findAllByIdInAndUserId(List<Long> testIds, Long userId) {

        return testRepository.findAllByIdInAndUserId(testIds, userId);
    }

    public Test update(Test updatedTest, Long userId) {
        log.info("Updating test by user. Test ID: {}. User ID: {}", updatedTest.getId(), userId);

        Test foundTest = findAllByIdAndUserIdOrThrow(updatedTest.getId(), userId);
        foundTest.setTitle(updatedTest.getTitle());

        foundTest.getQuestions().forEach(foundQuestion -> {
            Question updatedQuestion = updatedTest.getQuestions().stream()
                .filter(q -> q.getId().equals(foundQuestion.getId()))
                .findFirst()
                .orElse(null);

            if (updatedQuestion != null) {
                foundQuestion.setQuestionText(updatedQuestion.getQuestionText());

                foundQuestion.getAnswerOptions().forEach(foundAnswerOption -> {
                    AnswerOption updatedAnswerOption = updatedQuestion.getAnswerOptions().stream()
                        .filter(ao -> ao.getId().equals(foundAnswerOption.getId()))
                        .findFirst()
                        .orElse(null);

                    if (updatedAnswerOption != null) {
                        foundAnswerOption.setOptionText(updatedAnswerOption.getOptionText());
                        foundAnswerOption.setIsCorrect(updatedAnswerOption.getIsCorrect());
                    }
                });
            }
        });

        foundTest.setUserId(userId);
        return testRepository.save(foundTest);
    }

    public List<Test> findAllByTextIdAndUserId(Long textId, Long userId) {
        return testRepository.findAllByTextIdAndUserId(textId, userId);
    }
}
