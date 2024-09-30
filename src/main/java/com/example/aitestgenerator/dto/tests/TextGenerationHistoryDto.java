package com.example.aitestgenerator.dto.tests;

import com.example.aitestgenerator.models.enums.GenerationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Builder
@Data
public class TextGenerationHistoryDto {

    private Long id;
    private Long userId;
    private long testId;
    private String testTitle;
    private LocalDateTime generationStart;
    private LocalDateTime generationEnd;
    private GenerationStatus generationStatus;
    private String fileName;
}
