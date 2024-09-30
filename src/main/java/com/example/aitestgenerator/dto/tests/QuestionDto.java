package com.example.aitestgenerator.dto.tests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
@Jacksonized
public class QuestionDto {

    private String questionText;
    private List<AnswerOptionDto> answerOptions;
}
