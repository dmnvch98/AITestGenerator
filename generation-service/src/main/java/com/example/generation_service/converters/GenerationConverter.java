package com.example.generation_service.converters;

import com.example.generation_service.dto.generation.*;
import com.example.generation_service.generators.models.GenerateTestRequest;
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

    default String convert(final GenerateTestRequest questionsRequestDto) throws JsonProcessingException {
        return MAPPER.writeValueAsString(convertRequest(questionsRequestDto));
    }

    GenerateQuestionsRequestDto convertRequest(final GenerateTestRequest generateTestRequest);

    default String convert(final GenerateQuestionsResponseDto questionsResponseDto, final GenerateDto request) throws JsonProcessingException {
        return MAPPER.writeValueAsString(convertRequest(questionsResponseDto, request));
    }

    @Mapping(source = "request.minAnswersCount", target = "minAnswersCount")
    @Mapping(source = "request.maxAnswersCount", target = "maxAnswersCount")
    @Mapping(source = "request.content", target = "text")
    @Mapping(source = "questionsResponseDto.questions", target = "questions", qualifiedByName = "getQuestions")
    @Mapping(source = "questionsResponseDto.title", target = "title")
    GenerateAnswersRequestDto convertRequest(final GenerateQuestionsResponseDto questionsResponseDto, final GenerateDto request);

    default String convert(final GenerateQuestionsResponseDto questionsResponseDto, final GenerateTestRequest request) throws JsonProcessingException {
        return MAPPER.writeValueAsString(convertRequest(questionsResponseDto, request));
    }

    @Mapping(source = "request.minAnswersCount", target = "minAnswersCount")
    @Mapping(source = "request.maxAnswersCount", target = "maxAnswersCount")
    @Mapping(source = "questionsResponseDto.questions", target = "questions", qualifiedByName = "getQuestions")
    @Mapping(source = "questionsResponseDto.title", target = "title")
    GenerateAnswersRequestDto convertRequest(final GenerateQuestionsResponseDto questionsResponseDto, final GenerateTestRequest request);

    default GenerateAnswersResponseDto convertToAnswersResponseDto(final String jsonResponseDto) throws JsonProcessingException {
        return MAPPER.readValue(jsonResponseDto, GenerateAnswersResponseDto.class);
    }

    @Named("getQuestions")
    default List<String> getQuestions(final List<GenerateQuestionsResponseDto.QuestionDto> questions) {
        return questions.stream().map(GenerateQuestionsResponseDto.QuestionDto::getQuestionText).toList();
    }
}
