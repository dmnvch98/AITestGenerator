package com.example.generation_service.dto.tests;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class TestsResponseDto {

  private final List<TestResponseDto> tests;

  @Getter
  @Builder
  public static class TestResponseDto {

    private final Long id;
    private final String fileName;
    private final String title;
    private final LocalDateTime createdAt;
  }


}
