package com.example.aitestgenerator.dto.generation;

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
    private final String text;
    private final List<String> questions;
    private final int minAnswersCount;
    private final int maxAnswersCount;
}
