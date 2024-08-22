package com.example.aitestgenerator.dto.generation;

import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

@Jacksonized
@Builder
@Getter
public class GenerateDto {

    private final String content;
    private final int questionsCount;
    private final int minAnswersCount;
    private final int maxAnswersCount;
}