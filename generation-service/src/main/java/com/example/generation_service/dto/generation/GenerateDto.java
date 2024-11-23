package com.example.generation_service.dto.generation;

import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

@Jacksonized
@Builder
@Getter
public class GenerateDto {

    private final String content;
    private final int questionsCount;
    private final int answersCount;
    private final int correctAnswersCount;
}