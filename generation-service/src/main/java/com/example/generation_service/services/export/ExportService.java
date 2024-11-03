package com.example.generation_service.services.export;

import com.example.generation_service.dto.tests.export.ExportTestRequestDto;
import com.example.generation_service.models.test.Test;
import com.example.generation_service.services.export.model.ExportedTest;

import java.io.IOException;

public interface ExportService {

    ExportedTest export (Test test, ExportTestRequestDto requestDto) throws IOException;

}
