package com.example.generation_service.dto.tests;

import com.example.generation_service.models.generation.QuestionType;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.jackson.Jacksonized;

import java.io.Serializable;

@Jacksonized
@Builder
@Getter
@ToString
public class QuestionTypeQuantity implements Serializable {

    private final QuestionType questionType;
    private final int maxQuestions;
}
