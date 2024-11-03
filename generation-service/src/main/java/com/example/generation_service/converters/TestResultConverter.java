package com.example.generation_service.converters;

import com.example.generation_service.dto.tests.TestResultDto;
import com.example.generation_service.models.test.Test;
import com.example.generation_service.models.test.TestResult;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface TestResultConverter {

    ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Mapping(target = "data", expression = "java(convertQuestionAnswersToJson(dto.getQuestionAnswers()))")
    @Mapping(target = "testPassedTime", source = "testPassedTime")
    @Mapping(target = "id", source = "dto.id")
    @Mapping(target = "test", source = "test")
    TestResult convert(final TestResultDto dto, final long userId, final Test test, final LocalDateTime testPassedTime);

    @Mapping(target = "questionAnswers", expression = "java(convertJsonToQuestionAnswers(testResult.getData()))")
    @Mapping(target = "testId", source = "testResult.test.id")
    TestResultDto convert(final TestResult testResult);

    default String convertQuestionAnswersToJson(final List<TestResultDto.QuestionAnswer> questionAnswers) {
        try {
            return OBJECT_MAPPER.writeValueAsString(questionAnswers);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting QuestionAnswer list to JSON", e);
        }
    }

    default List<TestResultDto.QuestionAnswer> convertJsonToQuestionAnswers(final String json) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(json, new TypeReference<>() {
            });
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting JSON to QuestionAnswer list", e);
        }
    }
}
