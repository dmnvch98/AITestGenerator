package com.example.aitestgenerator.services;

import com.example.aitestgenerator.models.*;
import com.example.aitestgenerator.repositories.TestRepository;
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

    public Test prepareTestAndSave(final Test test) {
        test.getQuestions().forEach(question -> {
            question.setTest(test);
            question
                    .getAnswerOptions()
                    .forEach(answerOption -> answerOption.setQuestion(question));
        });
        return testRepository.save(test);
    }

    public Test prepareTestAndSave(final Test test, final long userId) {
        test.setUserId(userId);
        return prepareTestAndSave(test);
    }

    public List<Test> findAllByUserId(Long userId) {
        return testRepository.findAllByUserId(userId);
    }

    public void deleteTest(Long testId) {
        testRepository.deleteTestById(testId);
    }

    public Test findAllByIdAndUserIdOrThrow(Long testId, Long userId) {
        return testRepository.findTestByIdAndUserId(testId, userId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, String.format("Test with Id %d not found for user with id: %d", testId, userId)));
    }

    public List<Test> findAllByIdInAndUserId(List<Long> testIds, Long userId) {
        return testRepository.findAllByIdInAndUserIdOrderByIdDesc(testIds, userId);
    }

    public Test upsert(final Test updatedTest, final Long userId) {

        if (updatedTest.getId() == null) {
            return prepareTestAndSave(updatedTest, userId);
        }

        Test existingTest = testRepository.findTestByIdAndUserId(updatedTest.getId(), userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Test not found"));

        existingTest.setTitle(updatedTest.getTitle());

        existingTest.getQuestions().clear();
        testRepository.save(existingTest);

        for (Question updatedQuestion : updatedTest.getQuestions()) {
            updatedQuestion.setTest(existingTest);
            for (AnswerOption updatedOption : updatedQuestion.getAnswerOptions()) {
                updatedOption.setQuestion(updatedQuestion);
            }
            existingTest.getQuestions().add(updatedQuestion);
        }

        return testRepository.save(existingTest);
    }

}
