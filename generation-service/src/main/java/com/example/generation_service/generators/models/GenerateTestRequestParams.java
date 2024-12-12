package com.example.generation_service.generators.models;

import com.example.generation_service.models.files.FileHash;
import com.example.generation_service.models.generation.TestQuestionsType;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class GenerateTestRequestParams {

    private final FileHash fileHash;
    private final String text;
    private final Long userId;
    private final int maxQuestionsCount;
    private final int answersCount;
    private final int correctAnswersCount;
    private final double topP;
    private final double temperature;
    private final String testGenKey;
    private final TestQuestionsType questionsType;
}