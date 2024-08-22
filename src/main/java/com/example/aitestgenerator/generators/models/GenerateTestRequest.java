package com.example.aitestgenerator.generators.models;

import com.example.aitestgenerator.models.FileHash;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class GenerateTestRequest {

    private TestGeneratingHistory history;
    private final FileHash fileHash;
    private final String text;
    private final Long userId;
    @Builder.Default
    private final int maxQuestionsCount = 5;
    @Builder.Default
    private final int minAnswersCount = 3;
    @Builder.Default
    private final int maxAnswersCount = 5;
}
