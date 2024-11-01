package com.example.generation_service.services;

import com.example.generation_service.annotations.enumeration.ActionType;
import com.example.generation_service.annotations.useractions.TrackAction;
import com.example.generation_service.models.*;
import com.example.generation_service.repositories.TestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
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

    public Test save(final Test test) {
        return testRepository.save(test);
    }

    public List<Test> findAllByUserId(Long userId) {
        return testRepository.findAllByUserId(userId, Sort.by("createdAt").descending());
    }

    public void deleteTest(Long testId) {
        testRepository.deleteTestById(testId);
    }

    public Test findAllByIdAndUserIdOrThrow(Long testId, Long userId) {
        return testRepository.findTestByIdAndUserId(testId, userId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, String.format("Test with Id %d not found for user with id: %d", testId, userId)));
    }

    public Optional<Test> findAllByIdAndUserId(Long testId, Long userId) {
        return testRepository.findTestByIdAndUserId(testId, userId);
    }

    public List<Test> findAllByIdInAndUserId(List<Long> testIds, Long userId) {
        return testRepository.findAllByIdInAndUserId(testIds, userId, Sort.by("createdAt").descending());
    }

    @TrackAction(ActionType.CREATE_TEST)
    public Test insertTest(final Test test, final Long userId) {
        return testRepository.save(test);
    }

    @TrackAction(ActionType.UPDATE_TEST)
    public Test updateTest(final Test test, final Long userId) {
        return testRepository.save(test);
    }

}
