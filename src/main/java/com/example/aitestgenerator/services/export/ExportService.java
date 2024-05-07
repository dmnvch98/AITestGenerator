package com.example.aitestgenerator.services.export;

import com.example.aitestgenerator.dto.tests.export.ExportTestRequestDto;
import com.example.aitestgenerator.models.Test;

import java.io.IOException;

public interface ExportService {

    void export(Test test, ExportTestRequestDto requestDto) throws IOException;

}
