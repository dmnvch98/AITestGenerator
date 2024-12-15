package com.example.generation_service.dto.tests;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.jackson.Jacksonized;

import java.io.Serializable;
import java.util.List;

@Jacksonized
@Builder
@Getter
@ToString
public class GenerateTestRequestDto implements Serializable {

    final String hashedFileName;
    @Builder.Default
    private final int maxQuestionsCount = 5;

    private final List<QuestionTypeQuantity> params;
}
