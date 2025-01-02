package com.example.generation_service.dto.generation;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Builder
@Getter
@Jacksonized
@EqualsAndHashCode
@JsonIgnoreProperties(ignoreUnknown = true)
public class GenerateTestCorrectAnswersResponseDto {

    private final String title;
    private final List<QuestionDto> questions;
    private final String language;

    @Jacksonized
    @Builder
    @Getter
    public static class QuestionDto {

        @Builder.Default
        private final Long id = System.nanoTime();
        private final String questionText;
        private final List<Object> correctAnswers;
        private final String textReference;
    }
}
