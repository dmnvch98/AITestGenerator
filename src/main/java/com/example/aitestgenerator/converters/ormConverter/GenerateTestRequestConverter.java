package com.example.aitestgenerator.converters.ormConverter;

import com.example.aitestgenerator.dto.tests.GenerateTestRequestDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class GenerateTestRequestConverter implements AttributeConverter<GenerateTestRequestDto, String> {

  private final ObjectMapper objectMapper = new ObjectMapper();

  @Override
  public String convertToDatabaseColumn(final GenerateTestRequestDto requestDto) {
    try {
      return requestDto != null ? objectMapper.writeValueAsString(requestDto) : null;
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Error converting GenerateTestRequestDto to String", e);
    }
  }

  @Override
  public GenerateTestRequestDto convertToEntityAttribute(String s) {
    try {
      return s != null ? objectMapper.readValue(s, new TypeReference<>() {
      }) : null;
    } catch (Exception e) {
      throw new RuntimeException("Error converting String to GenerateTestRequestDto", e);
    }
  }
}
