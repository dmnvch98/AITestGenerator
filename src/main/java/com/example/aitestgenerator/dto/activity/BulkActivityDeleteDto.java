package com.example.aitestgenerator.dto.activity;

import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Jacksonized
@Builder
@Getter
public class BulkActivityDeleteDto {

  private final List<String> cids;
}
