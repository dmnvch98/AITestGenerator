package com.example.aitestgenerator.services;

import com.example.aitestgenerator.converters.TestConverter;
import com.example.aitestgenerator.models.*;
import com.example.aitestgenerator.repositories.TestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestService {

    private final TestRepository testRepository;
    private final TestConverter testConverter;

    public Test save(final Test test) {
        return testRepository.save(test);
    }

//    public Test prepareTestAndSave(final Test test) {
//        test.getQuestions().forEach(question -> {
//            question.setTest(test);
//            question
//                    .getAnswerOptions()
//                    .forEach(answerOption -> answerOption.setQuestion(question));
//        });
//        return testRepository.save(test);
//    }

//    public Test prepareTestAndSave(final Test test, final long userId) {
//        test.setUserId(userId);
//        return prepareTestAndSave(test);
//    }

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

    public Test upsert(final Test test, final Long userId) {
        final Test testToSave = Optional.ofNullable(test.getId())
              .flatMap(id -> testRepository.findTestByIdAndUserId(id, userId))
              .map(existingTest -> updateTestFields(existingTest, test))
              .orElseGet(() -> testConverter.convert(test, userId));
        return testRepository.save(testToSave);
    }

    private Test updateTestFields(final Test existingTest, final Test updateTest) {
        existingTest.setQuestions(updateTest.getQuestions());
        if (!existingTest.getTitle().equals(updateTest.getTitle())) {
            existingTest.setTitle(updateTest.getTitle());
        }
        return existingTest;
    }

}
