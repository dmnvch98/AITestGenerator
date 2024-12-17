package com.example.generation_service.dto.activity;

import com.example.generation_service.exceptionHandler.enumaration.GenerationFailReason;
import com.example.generation_service.models.enums.ActivityStatus;
import com.example.generation_service.models.generation.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.jackson.Jacksonized;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Builder
@Getter
@AllArgsConstructor
@ToString
@Jacksonized
public class TestGenerationActivityRequestDto {

  @Builder.Default
  private final UUID id = UUID.randomUUID();
  private final LocalDateTime startDate;
  private final LocalDateTime endDate;
  private final ActivityStatus status;
  private final String fileName;
  private final Long testId;
  private final String testTitle;
  private final GenerationFailReason failReason;
  private final String cid;
  private final Set<QuestionType> queuedQuestionTypes;
  private final Set<QuestionType> processedQuestionTypes;
}
