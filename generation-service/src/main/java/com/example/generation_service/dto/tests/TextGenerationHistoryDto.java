package com.example.generation_service.dto.tests;

import com.example.generation_service.models.enums.ActivityStatus;
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
    private final LocalDateTime startDate;
    private final LocalDateTime endDate;
    private final ActivityStatus status;
    private final String fileName;
    private final Integer failCode;
}
