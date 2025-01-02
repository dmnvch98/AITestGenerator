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

    default GenerateTestCorrectAnswersResponseDto convertTestIncorrectAnswers(final String jsonResponseDto) throws JsonProcessingException {
        return MAPPER.readValue(jsonResponseDto, GenerateTestCorrectAnswersResponseDto.class);
    }

    default GenerateTestIncorrectAnswersResponseDto convertTestIncorrectAnswersDto(final String json) throws JsonProcessingException {
        return MAPPER.readValue(json, GenerateTestIncorrectAnswersResponseDto.class);
    }

    default String convertTestIncorrectAnswers(final GenerateTestRequestParams questionsRequestDto) throws JsonProcessingException {
        return MAPPER.writeValueAsString(convertRequest(questionsRequestDto));
    }

    GenerateQuestionsRequestDto convertRequest(final GenerateTestRequestParams generateTestRequest);

    @Mapping(source = "questionsResponseDto.questions", target = "questions", qualifiedByName = "getQuestions")
    @Mapping(source = "questionsResponseDto.title", target = "title")
    GenerateAnswersRequestDto convertRequest(final GenerateTestCorrectAnswersResponseDto questionsResponseDto, final GenerateDto request);

    default String convertTestIncorrectAnswers(final GenerateTestCorrectAnswersResponseDto questionsResponseDto) throws JsonProcessingException {
        return MAPPER.writeValueAsString(questionsResponseDto);
    }

    @Named("getQuestions")
    default List<String> getQuestions(final List<GenerateTestCorrectAnswersResponseDto.QuestionDto> questions) {
        return questions.stream().map(GenerateTestCorrectAnswersResponseDto.QuestionDto::getQuestionText).toList();
    }
}
