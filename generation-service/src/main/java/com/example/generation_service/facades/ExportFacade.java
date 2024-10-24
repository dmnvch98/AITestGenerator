package com.example.generation_service.facades;

import com.example.generation_service.dto.tests.export.ExportTestRequestDto;
import com.example.generation_service.models.Test;
import com.example.generation_service.services.TestService;
import com.example.generation_service.services.export.ExportService;
import com.example.generation_service.services.export.model.ExportedTest;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class ExportFacade {

    private final Map<String, ExportService> exportServiceMap;
    private final TestService testService;

    @SneakyThrows
    public ExportedTest export(ExportTestRequestDto requestDto, Long testId, Long userId) {
        final Test test = testService.findAllByIdAndUserIdOrThrow(testId, userId);
        return exportServiceMap.get(requestDto.getExportFormat()).export(test, requestDto);
    }
}
