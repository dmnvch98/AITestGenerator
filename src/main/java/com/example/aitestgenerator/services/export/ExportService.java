package com.example.aitestgenerator.services.export;

import com.example.aitestgenerator.dto.tests.export.ExportTestRequestDto;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.services.export.model.ExportedTest;

import java.io.IOException;

public interface ExportService {

    ExportedTest export (Test test, ExportTestRequestDto requestDto) throws IOException;

}
