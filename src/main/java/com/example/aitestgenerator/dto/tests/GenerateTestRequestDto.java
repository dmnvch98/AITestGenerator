package com.example.aitestgenerator.dto.tests;

import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

@Jacksonized
@Builder
@Getter
public class GenerateTestRequestDto {

    final Long textId;
}
