package com.example.generation_service.services.export.model;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ExportedTest {

    byte[] bytes;
    String fileName;

}
