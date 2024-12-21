package com.example.generation_service.dto.tests.upsert;

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
public class UpsertTestQuestionRequestDto {

    private final String questionText;
    private final List<UpsertTestAnswerOptionRequestDto> answerOptions;
    private final String textReference;
    private final QuestionType questionType;
}
