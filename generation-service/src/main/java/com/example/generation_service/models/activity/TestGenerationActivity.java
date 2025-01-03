package com.example.generation_service.models.activity;

import com.example.generation_service.dto.tests.GenerateTestRequestDto;
import com.example.generation_service.exceptionHandler.enumaration.GenerationFailReason;
import com.example.generation_service.models.enums.ActivityStatus;
import com.example.generation_service.models.generation.QuestionType;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Builder
@Jacksonized
@Getter
public class TestGenerationActivity implements Serializable {

  @Builder.Default
  private final UUID id = UUID.randomUUID();
  @Builder.Default
  private final LocalDateTime startDate = LocalDateTime.now();
  private final LocalDateTime endDate;
  private final ActivityStatus status;
  private final String messageReceipt;
  private final String cid;
  private final GenerateTestRequestDto requestDto;
  private final String fileName;
  private final Long userId;
  private final Long testId;
  private final String testTitle;
  private final GenerationFailReason failReason;
  private final Set<QuestionType> queuedQuestionTypes;
  @Builder.Default
  private final Set<QuestionType> processedQuestionTypes = new HashSet<>();
}
