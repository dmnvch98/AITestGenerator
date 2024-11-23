package com.example.generation_service.dto.tests;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.jackson.Jacksonized;

import java.io.Serializable;

@Jacksonized
@Builder
@Getter
@ToString
public class GenerateTestRequestDto implements Serializable {

    final String hashedFileName;
    @Builder.Default
    private final int maxQuestionsCount = 5;
    @Builder.Default
    private final int answersCount = 4;
    @Builder.Default
    private final int correctAnswersCount = 1;
    @Builder.Default
    private final double topP = 0.9;
    @Builder.Default
    private final double temperature = 0.3;
}
