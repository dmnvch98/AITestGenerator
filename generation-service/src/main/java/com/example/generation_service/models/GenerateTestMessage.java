package com.example.generation_service.models;

import com.example.generation_service.dto.tests.QuestionTypeQuantity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Builder
@Jacksonized
@Getter
public class GenerateTestMessage {

    private final String hashedFileName;
    private final long userId;
    @Setter
    private String messageId;
    @Setter
    private String receipt;
    private final int maxQuestionsCount;
    private final int answersCount;
    private final int correctAnswersCount;
    private final double topP;
    private final double temperature;
    private final String hashKey;
    private final String cid;
    private final List<QuestionTypeQuantity> params;

    @Override
    public String toString() {
        return "GenerateTestMessage{" +
              "hashedFileName='" + hashedFileName + '\'' +
              ", userId=" + userId +
              ", mesageId='" + messageId + '\'' +
              ", maxQuestionsCount=" + maxQuestionsCount +
              ", answersCount=" + answersCount +
              ", correctAnswersCount=" + correctAnswersCount +
              ", topP=" + topP +
              ", temperature=" + temperature +
              ", activityKey='" + hashKey + '\'' +
              ", cid='" + cid + '\'' +
              ", params='" + params.toString() + '\'' +
              '}';
    }
}
