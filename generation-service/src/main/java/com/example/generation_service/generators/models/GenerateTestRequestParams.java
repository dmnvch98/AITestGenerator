package com.example.generation_service.generators.models;

import com.example.generation_service.models.files.FileHash;
import com.example.generation_service.models.generation.QuestionType;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class GenerateTestRequestParams {

    private final FileHash fileHash;
    private final String text;
    private final Long userId;
    private final String testGenKey;
    private final QuestionType questionsType;
}
