package com.example.generation_service.dto.generation;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Builder
@Getter
@Jacksonized
@EqualsAndHashCode
public class GenerateAnswersRequestDto {

    private final String title;
    private final List<String> questions;
}
