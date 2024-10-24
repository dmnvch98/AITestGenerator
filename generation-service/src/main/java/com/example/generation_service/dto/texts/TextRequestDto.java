package com.example.generation_service.dto.texts;

import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

@Builder
@Jacksonized
@Getter
public class TextRequestDto {

  private long id;
  private String title;
  private String content;
}
