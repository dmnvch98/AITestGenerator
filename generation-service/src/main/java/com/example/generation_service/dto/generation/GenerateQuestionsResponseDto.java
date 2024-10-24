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
public class GenerateQuestionsResponseDto {

    private final String problems;
    private final String title;
    private final List<QuestionDto> questions;

    @Jacksonized
    @Builder
    @Getter
    public static class QuestionDto {

        private final String questionText;
    }
}
