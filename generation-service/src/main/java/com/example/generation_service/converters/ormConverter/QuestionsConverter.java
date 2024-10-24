package com.example.generation_service.converters.ormConverter;

import com.example.generation_service.dto.tests.QuestionDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.List;

@Converter(autoApply = true)
public class QuestionsConverter implements AttributeConverter<List<QuestionDto>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(final List<QuestionDto> attribute) {
        try {
            return attribute != null ? objectMapper.writeValueAsString(attribute) : null;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting List of Questions to String", e);
        }
    }

    @Override
    public List<QuestionDto> convertToEntityAttribute(final String dbData) {
        try {
            return dbData != null ? objectMapper.readValue(dbData, new TypeReference<>() {
            }) : null;
        } catch (Exception e) {
            throw new RuntimeException("Error converting String to List of Questions", e);
        }
    }
}
