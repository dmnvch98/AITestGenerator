package com.example.generation_service.dto.tests.upsert;

import com.example.generation_service.dto.tests.QuestionDto;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.util.List;

@Jacksonized
@Getter
@Builder
public class GetTestResponseDto {

    private final Long id;
    private final String title;
    private final List<QuestionDto> questions;
}
