package com.example.generation_service.dto.tests;

import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Jacksonized
@Builder
@Getter
public class BulkDeleteTestsRequestDto {

  private final List<Long> ids;
}
