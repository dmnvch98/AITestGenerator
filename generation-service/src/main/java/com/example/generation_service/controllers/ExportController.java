package com.example.generation_service.controllers;

import com.example.generation_service.config.security.service.PrincipalUser;
import com.example.generation_service.dto.tests.export.ExportTestRequestDto;
import com.example.generation_service.facades.ExportFacade;
import com.example.generation_service.services.export.model.ExportedTest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tests")
@RequiredArgsConstructor
public class ExportController {

    private final ExportFacade exportFacade;

    @PostMapping("/{testId}/export")
    public ResponseEntity<byte[]> export(
            @PathVariable("testId") final long testId,
            @RequestBody ExportTestRequestDto requestDto,
            Authentication authentication
    ) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        ExportedTest fileData = exportFacade.export(requestDto, testId, userId);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + fileData.getFileName() +"\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileData.getBytes());
    }
}
