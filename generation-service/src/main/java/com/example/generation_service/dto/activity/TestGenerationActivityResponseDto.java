package com.example.generation_service.dto.activity;

import com.example.generation_service.models.enums.ActivityStatus;
import com.example.generation_service.models.generation.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Builder
@Getter
@AllArgsConstructor
@ToString
public class TestGenerationActivityResponseDto implements Serializable {

  private final UUID id;
  private final LocalDateTime startDate;
  private final LocalDateTime endDate;
  private final ActivityStatus status;
  private final String fileName;
  private final Long testId;
  private final String testTitle;
  private final Integer failCode;
  private final String cid;
  private final Set<QuestionType> queuedQuestionTypes;
  private final Set<QuestionType> processedQuestionTypes;
}
