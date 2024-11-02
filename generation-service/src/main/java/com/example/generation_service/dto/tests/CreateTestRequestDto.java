package com.example.generation_service.dto.tests;

import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Jacksonized
@Getter
@Builder
public class CreateTestRequestDto {

  private final String title;
  private final List<QuestionDto> questions;
  private final String language;

}
