package com.example.aitestgenerator.dto.tests;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

@Builder
@Jacksonized
@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
public class TestRatingDto {

  private final Double rating;
  private final String feedback;
}
