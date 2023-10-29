package com.example.aitestgenerator.dto.tests;

import lombok.Builder;
import lombok.Data;
import lombok.Value;

import java.time.LocalDateTime;

@Builder
@Data
public class TextGenerationHistoryDto {
    private Long id;
    private Long userId;
    private Long testId;
    private Long textId;
    private LocalDateTime generationStart;
    private LocalDateTime generationEnd;
    private Integer inputTokensCount;
    private Integer outputTokensCount;
    private String generationStatus;
}
