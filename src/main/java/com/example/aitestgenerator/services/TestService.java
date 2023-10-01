package com.example.aitestgenerator.services;

import com.example.aitestgenerator.exceptions.AppException;
import com.example.aitestgenerator.models.AnswerOption;
import com.example.aitestgenerator.models.Question;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.models.Text;
import com.example.aitestgenerator.repositories.TestRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
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
        log.info("Saving test. Test title: {}", test.getTitle());
        return testRepository.save(test);
    }

    public Test generateTest(Text text, Integer maxQuestionNumber) throws JsonProcessingException {
        log.info("Generating test for chapter. Chapter ID '{}', max question number: {}", text.getId(), maxQuestionNumber);
        return testGenerator.generateTest(text, maxQuestionNumber);
    }

    public List<Test> findAllByUserId(Long userId) {
        log.info("Finding all tests for user. User ID: {}", userId);
        return testRepository.findAllByUserId(userId);
    }

    public void deleteTest(Test test) {
        log.info("Deleting test. Test ID: {}", test.getId());
        testRepository.delete(test);
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

        // Устанавливаем userId и сохраняем обновленный тест
        foundTest.setUserId(userId);
        return testRepository.save(foundTest);
    }
}
