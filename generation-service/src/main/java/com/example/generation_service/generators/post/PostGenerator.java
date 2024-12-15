package com.example.generation_service.generators.post;

import com.example.generation_service.converters.TestConverter;
import com.example.generation_service.dto.generation.GenerateTestAllAnswersResponseDto;
import com.example.generation_service.dto.generation.GenerateTestCorrectAnswersResponseDto;
import com.example.generation_service.generators.models.GenerateTestRequestParams;
import com.example.generation_service.models.generation.QuestionType;
import com.example.generation_service.models.test.Test;
import lombok.RequiredArgsConstructor;
import lombok.experimental.SuperBuilder;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.NotImplementedException;

@SuperBuilder
@Slf4j
@RequiredArgsConstructor
public abstract class PostGenerator {

    protected final TestConverter testConverter;

    public Test process(final GenerateTestCorrectAnswersResponseDto dto, final GenerateTestRequestParams request) {
        throw new NotImplementedException();
    }

    public Test process(final GenerateTestAllAnswersResponseDto dto, final GenerateTestRequestParams request) {
        throw new NotImplementedException();
    }

    public abstract QuestionType getTestQuestionsType();
}
