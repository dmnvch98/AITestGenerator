package com.example.aitestgenerator.generators.models;

import com.example.aitestgenerator.models.FileHash;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class GenerateTestRequest {

    private final FileHash fileHash;
    private final String text;
    private final Long userId;
    private final int maxQuestionsCount;
    private final int minAnswersCount;
    private final int maxAnswersCount;
    private final double topP;
    private final double temperature;
    private final String testGenKey;
}
