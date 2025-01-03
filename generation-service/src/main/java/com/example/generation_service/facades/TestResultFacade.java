package com.example.generation_service.facades;

import com.example.generation_service.converters.TestResultConverter;
import com.example.generation_service.dto.tests.TestResultDto;
import com.example.generation_service.models.test.Test;
import com.example.generation_service.models.test.TestResult;
import com.example.generation_service.services.TestResultService;
import com.example.generation_service.services.TestService;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
@AllArgsConstructor
public class TestResultFacade {

    private final TestResultService service;
    private final TestService testService;
    private final TestResultConverter converter;

    @SneakyThrows
    public TestResultDto save(final TestResultDto dto, final long userId, final long testId) {
        final Test test = testService.findAllByIdAndUserIdOrThrow(testId, userId);
        if (test != null) {
            TestResult testResult = converter.convert(dto, userId, test, LocalDateTime.now());
            service.save(testResult);
            return converter.convert(testResult);
        }
        return null;
    }

    public TestResultDto findById(final long testId, final long id, final long userId) {
        final Optional<TestResult> testResult = service.findByTestIdAndResultId(testId, id, userId);
        return testResult.map(converter::convert).orElse(null);
    }

    public List<TestResultDto> findAll(final long userId) {
        return service.findAll(userId).stream().map(converter::convert).toList();
    }
}
