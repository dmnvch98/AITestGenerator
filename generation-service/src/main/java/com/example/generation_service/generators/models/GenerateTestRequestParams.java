package com.example.generation_service.generators.models;

import com.example.generation_service.models.files.FileMetadata;
import com.example.generation_service.models.generation.QuestionType;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class GenerateTestRequestParams {

    private final FileMetadata fileHash;
    private final String text;
    private final Long userId;
    private final QuestionType questionType;
    private final int maxQuestions;
}
