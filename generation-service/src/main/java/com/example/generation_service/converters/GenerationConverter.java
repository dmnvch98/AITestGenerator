package com.example.generation_service.converters;

import com.example.generation_service.dto.generation.*;
import com.example.generation_service.generators.models.GenerateTestRequestParams;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper
public interface GenerationConverter {

    ObjectMapper MAPPER = new ObjectMapper();

    default GenerateQuestionsResponseDto convert(final String jsonResponseDto) throws JsonProcessingException {
        return MAPPER.readValue(jsonResponseDto, GenerateQuestionsResponseDto.class);
    }

    default String convert(final GenerateTestRequestParams questionsRequestDto) throws JsonProcessingException {
        return MAPPER.writeValueAsString(convertRequest(questionsRequestDto));
    }

    GenerateQuestionsRequestDto convertRequest(final GenerateTestRequestParams generateTestRequest);

    @Mapping(source = "questionsResponseDto.questions", target = "questions", qualifiedByName = "getQuestions")
    @Mapping(source = "questionsResponseDto.title", target = "title")
    GenerateAnswersRequestDto convertRequest(final GenerateQuestionsResponseDto questionsResponseDto, final GenerateDto request);

    default String convert(final GenerateQuestionsResponseDto questionsResponseDto) throws JsonProcessingException {
        return MAPPER.writeValueAsString(questionsResponseDto);
    }

    default GenerateAnswersResponseDto convertToAnswersResponseDto(final String jsonResponseDto) throws JsonProcessingException {
        return MAPPER.readValue(jsonResponseDto, GenerateAnswersResponseDto.class);
    }

    @Named("getQuestions")
    default List<String> getQuestions(final List<GenerateQuestionsResponseDto.QuestionDto> questions) {
        return questions.stream().map(GenerateQuestionsResponseDto.QuestionDto::getQuestionText).toList();
    }

    @Mapping(source = "dto.questions", target = "questions")
    @Mapping(source = "dto.title", target = "title")
    @Mapping(source = "request.text", target = "text")
    PostGenerationRequest convert(final GenerateAnswersResponseDto dto, final GenerateTestRequestParams request);

    default String constToPostGeneration(final GenerateAnswersResponseDto dto, final GenerateTestRequestParams request) throws JsonProcessingException {
        final PostGenerationRequest postGenerationRequest = convert(dto, request);
        return MAPPER.writeValueAsString(postGenerationRequest);
    }
}
