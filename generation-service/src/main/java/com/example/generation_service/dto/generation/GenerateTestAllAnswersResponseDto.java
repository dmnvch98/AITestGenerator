package com.example.generation_service.dto.generation;

import com.example.generation_service.dto.tests.AnswerOptionDto;
import com.example.generation_service.dto.tests.QuestionDto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Builder
@Getter
@Jacksonized
@JsonIgnoreProperties(ignoreUnknown = true)
public class GenerateTestAllAnswersResponseDto {

    private final String title;
    private final List<QuestionDto> questions;
    private final String language;

    @Builder
    @Getter
    @Jacksonized
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class QuestionDto {

        @Builder.Default
        private final Long id = System.nanoTime();
        private final String questionText;
        private final List<AnswerOptionDto> answerOptions;
        private final String textReference;
    }

}
