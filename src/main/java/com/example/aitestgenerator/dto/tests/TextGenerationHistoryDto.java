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
    private long testId;
    private String testTitle;
    private String textTitle;
    private long textId;
    private LocalDateTime generationStart;
    private LocalDateTime generationEnd;
    private String generationStatus;
}
