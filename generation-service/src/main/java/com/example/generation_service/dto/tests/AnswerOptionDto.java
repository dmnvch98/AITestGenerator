package com.example.generation_service.dto.tests;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;


@Builder
@Getter
@Jacksonized
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnswerOptionDto {

    @Builder.Default
    private final Long id = System.nanoTime();
    private final String optionText;
    @Getter(onMethod_ = {@JsonProperty("isCorrect")})
    private final boolean isCorrect;
}
