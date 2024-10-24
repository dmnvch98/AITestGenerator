package com.example.generation_service.dto.generation;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

@Builder
@Getter
@Jacksonized
@JsonIgnoreProperties(ignoreUnknown = true)
public class GenerateQuestionsRequestDto {

    private final String text;
    private final Integer maxQuestionsCount;
}
