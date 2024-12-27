package com.example.generation_service.converters.ormConverter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.concurrent.atomic.AtomicInteger;

@Converter(autoApply = true)
public class AtomicIntegerConverter implements AttributeConverter<AtomicInteger, Integer> {

    @Override
    public Integer convertToDatabaseColumn(AtomicInteger attribute) {
        return (attribute == null) ? null : attribute.get();
    }

    @Override
    public AtomicInteger convertToEntityAttribute(Integer dbData) {
        return (dbData == null) ? null : new AtomicInteger(dbData);
    }
}