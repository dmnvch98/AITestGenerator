package com.example.aitestgenerator.models;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.extern.jackson.Jacksonized;

@Builder
@Jacksonized
@Getter
@ToString
public class GenerateTestMessage {

    private final String hashedFileName;
    private final long userId;
    private final long historyId;
    @Setter
    private String receipt;
    private final int maxQuestionsCount;
    private final int minAnswersCount;
    private final int maxAnswersCount;
    private final double topP;
    private final double temperature;
}
