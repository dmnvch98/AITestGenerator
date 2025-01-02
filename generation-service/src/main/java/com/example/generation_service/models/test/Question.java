package com.example.generation_service.models.test;

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

    private final String questionText;
    private final List<AnswerOption> answerOptions;
    private final String textReference;
    private final QuestionType questionType;
}
