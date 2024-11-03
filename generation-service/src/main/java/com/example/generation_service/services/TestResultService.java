package com.example.generation_service.services;

import com.example.generation_service.models.test.TestResult;
import com.example.generation_service.repositories.test.TestResultRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class TestResultService {

    private final TestResultRepository repository;

    public TestResult save(TestResult testResult) {
        return repository.save(testResult);
    }

    public Optional<TestResult> findByTestIdAndResultId(final long testId, final Long id, final long userId) {
        return repository.findTestResultByTestIdAndIdAndUserId(testId, id, userId);
    }

    public List<TestResult> findAll(final long userId) {
        return repository.findAllByUserId(userId);
    }
}
