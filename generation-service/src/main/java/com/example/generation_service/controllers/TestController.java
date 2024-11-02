package com.example.generation_service.controllers;

import com.example.generation_service.config.security.service.PrincipalUser;
import com.example.generation_service.dto.tests.*;
import com.example.generation_service.facades.TestFacade;
import com.example.generation_service.models.Test;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tests")
@RequiredArgsConstructor
public class TestController {

    private final TestFacade testFacade;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Test save(@RequestBody CreateTestRequestDto test, Authentication authentication) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return testFacade.save(test, userId);
    }

    @PostMapping("/generate")
    public void generateTestByFileAndSave(final Authentication authentication, @RequestBody final GenerateTestRequestDto dto) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        testFacade.prepareTestGeneration(userId, dto);
    }

    @GetMapping("/{id}")
    public Test findAllById(Authentication authentication, @PathVariable Long id) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return testFacade.findTestById(id, userId);
    }

    @DeleteMapping("/{testId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTest(final Authentication authentication, @PathVariable Long testId) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        testFacade.deleteTest(testId, userId);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void bulkTestDelete(final Authentication authentication,
                               final @RequestBody BulkDeleteTestsRequestDto requestDto) {
        final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        requestDto.getIds().forEach(testId -> testFacade.deleteTest(testId, userId));
    }

    @PutMapping
    public Test upsert(final Authentication authentication, @RequestBody final Test test) {
        final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return testFacade.upsert(test, userId);
    }

    @GetMapping("/history")
    public List<TextGenerationHistoryDto> getTestGenerationHistory(
            final Authentication authentication,
            @RequestParam(value = "status", required = false) final String status) {
        final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return testFacade.getTestGenerationHistory(userId, status);
    }

    @GetMapping("/history/current")
    public List<TextGenerationHistoryDto> getCurrentTestGenerationHistory(
            final Authentication authentication) {
        final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return testFacade.getCurrentHistories(userId);
    }

    @GetMapping
    public TestsResponseDto getProducts(
            final Authentication authentication,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "id") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortDirection
    ) {
        final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return testFacade.findUserTests(userId, search, page, size, sortBy, sortDirection);
    }
}
