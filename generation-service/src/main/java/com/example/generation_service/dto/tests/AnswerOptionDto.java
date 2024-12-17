package com.example.generation_service.dto.tests;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.util.UUID;


@Builder
@Getter
@Jacksonized
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnswerOptionDto {

    @Builder.Default
    private final UUID id = UUID.randomUUID();
    private final String optionText;
    @JsonProperty("isCorrect")
    private final boolean isCorrect;
}
