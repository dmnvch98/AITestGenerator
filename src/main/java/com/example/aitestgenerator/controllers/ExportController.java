package com.example.aitestgenerator.controllers;

import com.example.aitestgenerator.config.security.service.PrincipalUser;
import com.example.aitestgenerator.dto.tests.export.ExportTestRequestDto;
import com.example.aitestgenerator.facades.ExportFacade;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/export/tests")
@RequiredArgsConstructor
public class ExportController {

    private final ExportFacade exportFacade;

    @PostMapping("/{testId}")
    @SneakyThrows
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void export(
            @PathVariable("testId") final long testId,
            @RequestBody ExportTestRequestDto requestDto,
            Authentication authentication
    ) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        exportFacade.export(requestDto, testId, userId);
    }
}
