package com.example.generation_service.controllers;

import com.example.generation_service.config.security.service.PrincipalUser;
import com.example.generation_service.dto.tests.TestResultDto;
import com.example.generation_service.facades.TestResultFacade;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tests/")
@AllArgsConstructor
public class TestResultController {

    private final TestResultFacade facade;

    @PostMapping("/{testId}/result")
    public ResponseEntity<TestResultDto> save(
            @RequestBody final TestResultDto dto,
            @PathVariable("testId") final long testId,
            final Authentication authentication) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return new ResponseEntity<>(facade.save(dto, userId, testId), HttpStatus.CREATED);
    }

    @GetMapping("/{testId}/result/{resultId}")
    public ResponseEntity<TestResultDto> getById(
            @PathVariable final Long testId,
            @PathVariable final Long resultId,
            final Authentication authentication
    ) {
        final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return new ResponseEntity<>(facade.findById(testId, resultId, userId), HttpStatus.OK);
    }

    @GetMapping("/results")
    public ResponseEntity<List<TestResultDto>> getAll(final Authentication authentication) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        List<TestResultDto> testResults = facade.findAll(userId);
        return new ResponseEntity<>(testResults, HttpStatus.OK);
    }
}
