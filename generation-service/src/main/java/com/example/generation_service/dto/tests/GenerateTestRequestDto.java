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
    private final int minAnswersCount = 4;
    @Builder.Default
    private final int maxAnswersCount = 5;
    @Builder.Default
    private final double topP = 0.6;
    @Builder.Default
    private final double temperature = 0.5;
}
