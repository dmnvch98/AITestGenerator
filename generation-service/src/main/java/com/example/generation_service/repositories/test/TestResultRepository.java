package com.example.generation_service.repositories.test;

import com.example.generation_service.models.test.TestResult;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface TestResultRepository extends CrudRepository<TestResult, Long> {

    Optional<TestResult> findTestResultByTestIdAndIdAndUserId(final long testId, final long id, final long userId);

    List<TestResult> findAllByUserId(final long userId);
}
