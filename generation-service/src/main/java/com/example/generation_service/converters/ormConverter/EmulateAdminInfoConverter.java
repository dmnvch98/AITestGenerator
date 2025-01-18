package com.example.generation_service.converters.ormConverter;

import com.example.generation_service.models.user.EmulateAdminInfo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EmulateAdminInfoConverter implements AttributeConverter<EmulateAdminInfo, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(final EmulateAdminInfo emulateAdminInfo) {
        try {
            return emulateAdminInfo != null ? objectMapper.writeValueAsString(emulateAdminInfo) : null;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting EmulateAdminInfo to String", e);
        }
    }

    @Override
    public EmulateAdminInfo convertToEntityAttribute(String s) {
        try {
            return s != null ? objectMapper.readValue(s, new TypeReference<>() {
            }) : null;
        } catch (Exception e) {
            throw new RuntimeException("Error converting String to EmulateAdminInfo", e);
        }
    }
}
