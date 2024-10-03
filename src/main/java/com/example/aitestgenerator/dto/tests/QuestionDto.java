package com.example.aitestgenerator.dto.tests;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.util.List;
import java.util.UUID;

@Builder
@Getter
@Jacksonized
@JsonIgnoreProperties(ignoreUnknown = true)
public class QuestionDto {

    @Builder.Default
    private final UUID id = UUID.randomUUID();
    private final String questionText;
    private final List<AnswerOptionDto> answerOptions;
}
