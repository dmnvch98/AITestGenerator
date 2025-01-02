package com.example.generation_service.dto.tests;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    private final boolean correct;
}
