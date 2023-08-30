package com.example.aitestgenerator.dto;

import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Jacksonized
@Builder
@Value
public class GenerateTestRequestDto {
    Long chapterId;
    Integer minQuestionNumber;
    Integer maxQuestionNumber;
}
