package com.example.generation_service.dto.generation;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Builder
@Getter
@Jacksonized
@JsonIgnoreProperties(ignoreUnknown = true)
public class GenerateTestIncorrectAnswersResponseDto {

    private final List<Question> questions;

    @Builder
    @Getter
    @Jacksonized
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Question {
        private final Long id;
        private final List<String> incorrectAnswers;
    }
}
