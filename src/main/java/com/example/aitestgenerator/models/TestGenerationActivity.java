package com.example.aitestgenerator.models;

import com.example.aitestgenerator.dto.tests.GenerateTestRequestDto;
import com.example.aitestgenerator.exceptionHandler.enumaration.GenerationFailReason;
import com.example.aitestgenerator.models.enums.ActivityStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Builder
@Jacksonized
@Getter
public class TestGenerationActivity implements Serializable {

  @Builder.Default
  private final UUID uuid = UUID.randomUUID();
  private final LocalDateTime startDate;
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

  public static TestGenerationActivity empty() {
    return TestGenerationActivity.builder().build();
  }
}
