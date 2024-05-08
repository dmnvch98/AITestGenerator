package com.example.aitestgenerator.facades;

import com.example.aitestgenerator.dto.tests.export.ExportTestRequestDto;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.services.TestService;
import com.example.aitestgenerator.services.export.ExportService;
import com.example.aitestgenerator.services.export.model.ExportedTest;
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
