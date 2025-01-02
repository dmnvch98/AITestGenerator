package com.example.generation_service.dto.tests.upsert;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

@Builder
@Getter
@Jacksonized
@JsonIgnoreProperties(ignoreUnknown = true)
public class UpsertTestAnswerOptionRequestDto {

    private final String optionText;
    private final boolean correct;
}
