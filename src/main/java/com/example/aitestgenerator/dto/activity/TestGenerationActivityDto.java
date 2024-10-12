package com.example.aitestgenerator.dto.activity;

import com.example.aitestgenerator.models.enums.ActivityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Builder
@Getter
@AllArgsConstructor
@ToString
public class TestGenerationActivityDto implements Serializable {

  private final UUID uuid;
  private final LocalDateTime startDate;
  private final LocalDateTime endDate;
  private final ActivityStatus status;
  private final String fileName;
}
