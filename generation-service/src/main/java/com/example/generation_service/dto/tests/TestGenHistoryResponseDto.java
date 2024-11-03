package com.example.generation_service.dto.tests;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class TestGenHistoryResponseDto {

    private final List<TextGenerationHistoryDto> history;
    private final int totalPages;
    private final long totalElements;

}
