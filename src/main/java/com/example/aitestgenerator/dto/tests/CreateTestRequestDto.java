package com.example.aitestgenerator.dto.tests;

import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.util.Set;

@Jacksonized
@Getter
@Builder
public class CreateTestRequestDto {

  private final String title;
  private final Set<QuestionDto> questions;
}
