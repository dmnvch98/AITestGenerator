package com.example.aitestgenerator.converters;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;

@Converter(autoApply = true)
public class JsonConverter implements AttributeConverter<JsonNode, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(final JsonNode attribute) {
        try {
            return attribute != null ? objectMapper.writeValueAsString(attribute) : null;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting JSON to String", e);
        }
    }

    @Override
    public JsonNode convertToEntityAttribute(final String dbData) {
        try {
            return dbData != null ? objectMapper.readTree(dbData) : null;
        } catch (Exception e) {
            throw new RuntimeException("Error converting String to JSON", e);
        }
    }
}
