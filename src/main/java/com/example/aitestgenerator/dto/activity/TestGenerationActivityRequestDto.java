package com.example.aitestgenerator.dto.activity;

import com.example.aitestgenerator.exceptionHandler.enumaration.GenerationFailReason;
import com.example.aitestgenerator.models.enums.ActivityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.jackson.Jacksonized;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
@Getter
@AllArgsConstructor
@ToString
@Jacksonized
public class TestGenerationActivityRequestDto {

  @Builder.Default
  private final UUID uuid = UUID.randomUUID();
  private final LocalDateTime startDate;
  private final LocalDateTime endDate;
  private final ActivityStatus status;
  private final String fileName;
  private final Long testId;
  private final String testTitle;
  private final GenerationFailReason failReason;
  private final String cid;
}
