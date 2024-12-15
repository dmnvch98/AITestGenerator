package com.example.generation_service.models.test;

import com.example.generation_service.dto.tests.AnswerOptionDto;
import com.example.generation_service.models.generation.QuestionType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Builder
@Getter
@Jacksonized
@JsonIgnoreProperties(ignoreUnknown = true)
public class Question {

    @Builder.Default
    private final Long id = System.nanoTime();
    private final String questionText;
    private final List<AnswerOptionDto> answerOptions;
    private final String textReference;
    private QuestionType questionType;
}
