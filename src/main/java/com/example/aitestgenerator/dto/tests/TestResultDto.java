package com.example.aitestgenerator.dto.tests;

import lombok.Builder;
import lombok.Getter;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Jacksonized
@Getter
public class TestResultDto {

    private Long id;
    private List<QuestionAnswer> questionAnswers;
    private LocalDateTime testPassedTime;
    private String testTitle;
    private Long testId;

    @Value
    @Builder
    @Jacksonized
    public static class QuestionAnswer {
        int questionNumber;
        boolean passed;
    }
}
