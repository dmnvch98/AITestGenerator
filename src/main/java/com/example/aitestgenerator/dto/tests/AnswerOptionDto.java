package com.example.aitestgenerator.dto.tests;

import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

@Data
@Builder
@Jacksonized
public class AnswerOptionDto {

    private String optionText;
    private Boolean isCorrect;
}
