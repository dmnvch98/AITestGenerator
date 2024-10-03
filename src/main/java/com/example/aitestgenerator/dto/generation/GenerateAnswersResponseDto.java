package com.example.aitestgenerator.dto.generation;

import com.example.aitestgenerator.dto.tests.QuestionDto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Builder
@Getter
@Jacksonized
@JsonIgnoreProperties(ignoreUnknown = true)
public class GenerateAnswersResponseDto {

    private final String title;
    private final List<QuestionDto> questions;

}
