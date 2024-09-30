package com.example.aitestgenerator.dto.tests;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

@Jacksonized
@Getter
@Builder
public class CreateTestRequestDto {

  private final String title;
  private final JsonNode questions;
//  private final TestData data;
//
//  @Getter
//  @Jacksonized
//  @Builder
//  @AllArgsConstructor
//  @NoArgsConstructor
//  public static class TestData {
//    private List<QuestionDto> questions;
//  }
//
//  @Getter
//  @Jacksonized
//  @Builder
//  @AllArgsConstructor
//  @NoArgsConstructor
//  public static class QuestionDto {
//    private String questionText;
//    private List<AnswerOptionDto> answerOptions;
//  }
//
//  @Getter
//  @Jacksonized
//  @Builder
//  @AllArgsConstructor
//  @NoArgsConstructor
//  public static class AnswerOptionDto {
//    private String optionText;
//    private Boolean isCorrect;
//  }
}
