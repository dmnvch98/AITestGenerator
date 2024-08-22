package com.example.aitestgenerator.controllers;

import com.example.aitestgenerator.config.security.service.PrincipalUser;
import com.example.aitestgenerator.dto.tests.GenerateTestRequestDto;
import com.example.aitestgenerator.dto.tests.TextGenerationHistoryDto;
import com.example.aitestgenerator.facades.TestFacade;
import com.example.aitestgenerator.models.Test;
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
    public Test save(@RequestBody Test test, Authentication authentication) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return testFacade.save(test, userId);
    }

//    @PostMapping("/generate")
//    public void generateTestAndSave(final Authentication authentication, @RequestBody final GenerateTestRequestDto dto) {
//        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
//        testFacade.generateTestByTextSendMessage(userId, dto.getTextId());
//    }

    @PostMapping("/generate")
    public void generateTestByFileAndSave(final Authentication authentication, @RequestBody final GenerateTestRequestDto dto) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        testFacade.prepareTestGeneration(userId, dto);
    }

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

    @DeleteMapping("/{testId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTest(Authentication authentication, @PathVariable Long testId) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        testFacade.deleteTest(testId, userId);
    }

    @PutMapping
    public Test updateTest(Authentication authentication, @RequestBody Test updatedTest) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return testFacade.updateTest(updatedTest, userId);
    }

    @GetMapping("/history")
    public List<TextGenerationHistoryDto> getTestGenerationHistory(
            final Authentication authentication,
            @RequestParam(value = "status", required = false) final String status) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return testFacade.getTestGenerationHistory(userId, status);
    }

    @GetMapping("/history/current")
    public List<TextGenerationHistoryDto> getCurrentTestGenerationHistory(
            final Authentication authentication) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return testFacade.getCurrentHistories(userId);
    }
}
