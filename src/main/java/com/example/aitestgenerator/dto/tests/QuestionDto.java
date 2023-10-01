package com.example.aitestgenerator.dto.tests;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class QuestionDto {
    private String questionText;
    private List<AnswerOptionDto> answerOptions;
}
