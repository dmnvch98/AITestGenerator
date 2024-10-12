package com.example.aitestgenerator.models;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Builder
@Jacksonized
@Getter
public class GenerateTestMessage {

    private final String hashedFileName;
    private final long userId;
    @Setter
    private String receipt;
    private final int maxQuestionsCount;
    private final int minAnswersCount;
    private final int maxAnswersCount;
    private final double topP;
    private final double temperature;
    private final String hashKey;
    private final String cid;

    @Override
    public String toString() {
        return "GenerateTestMessage{" +
              "hashedFileName='" + hashedFileName + '\'' +
              ", userId=" + userId +
              ", receipt='" + receipt + '\'' +
              ", maxQuestionsCount=" + maxQuestionsCount +
              ", minAnswersCount=" + minAnswersCount +
              ", maxAnswersCount=" + maxAnswersCount +
              ", topP=" + topP +
              ", temperature=" + temperature +
              ", activityKey='" + hashKey + '\'' +
              ", cid='" + cid + '\'' +
              '}';
    }
}
