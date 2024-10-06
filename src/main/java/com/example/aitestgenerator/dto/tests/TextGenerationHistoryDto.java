package com.example.aitestgenerator.dto.tests;

import com.example.aitestgenerator.models.enums.GenerationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Builder
@Data
public class TextGenerationHistoryDto {

    private final Long id;
    private final Long userId;
    private final long testId;
    private final String testTitle;
    private final LocalDateTime generationStart;
    private final LocalDateTime generationEnd;
    private final GenerationStatus generationStatus;
    private final String fileName;
    private final Integer failCode;
}
