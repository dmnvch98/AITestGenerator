package com.example.aitestgenerator.dto.tests;

import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Jacksonized
@Builder
@Value
public class GenerateTestRequestDto {
    Long textId;
    Integer maxQuestionNumber;
}
