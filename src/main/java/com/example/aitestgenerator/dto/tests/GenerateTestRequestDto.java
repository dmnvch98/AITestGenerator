package com.example.aitestgenerator.dto.tests;

import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

@Jacksonized
@Builder
@Getter
public class GenerateTestRequestDto {

    final String hashedFileName;
    @Builder.Default
    private final int maxQuestionsCount = 5;
    @Builder.Default
    private final int minAnswersCount = 4;
    @Builder.Default
    private final int maxAnswersCount = 5;
}
