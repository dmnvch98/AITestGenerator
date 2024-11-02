package com.example.generation_service.converters.ormConverter;

import com.example.generation_service.dto.tests.QuestionDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Converter(autoApply = true)
@Slf4j
public class QuestionsConverter implements AttributeConverter<List<QuestionDto>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(final List<QuestionDto> attribute) {
        try {
            return attribute != null && !attribute.isEmpty() ?
                    objectMapper.writeValueAsString(attribute) : "[]";
        } catch (JsonProcessingException e) {
            log.error("Error converting List of Questions to String: {}", e.getMessage());
            throw new RuntimeException("Error converting List of Questions to String", e);
        }
    }

    @Override
    public List<QuestionDto> convertToEntityAttribute(final String dbData) {
        try {
            return dbData != null && !dbData.isEmpty() ?
                    objectMapper.readValue(dbData, new TypeReference<>() {}) : List.of();
        } catch (Exception e) {
            log.error("Error converting String to List of Questions: {}", e.getMessage());
            throw new RuntimeException("Error converting String to List of Questions", e);
        }
    }
}
