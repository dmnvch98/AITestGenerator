package com.example.aitestgenerator.controllers;

import com.example.aitestgenerator.config.security.service.PrincipalUser;
import com.example.aitestgenerator.dto.tests.GenerateTestRequestDto;
import com.example.aitestgenerator.facades.TestFacade;
import com.example.aitestgenerator.models.Test;
import com.fasterxml.jackson.core.JsonProcessingException;
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

    @GetMapping
    public List<Test> findAllByUser(@RequestParam(value = "ids", required = false) Long[] ids, Authentication authentication) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return testFacade.findAllByUser(ids, userId);
    }

    @GetMapping("/{id}")
    public Test findAllById(Authentication authentication, @PathVariable Long id) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return testFacade.findTestById(id, userId);
    }

    @PostMapping
    public Test generateTestAndSave(Authentication authentication, @RequestBody GenerateTestRequestDto dto) throws JsonProcessingException {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return testFacade.generateTestAndSave(userId, dto);
    }

    @DeleteMapping("/{testId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTest(Authentication authentication, @PathVariable Long testId) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        testFacade.deleteTest(testId, userId);
    }

    @PatchMapping
    public Test updateTest(Authentication authentication, @RequestBody Test updatedTest) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return testFacade.updateTest(updatedTest, userId);
    }
}
