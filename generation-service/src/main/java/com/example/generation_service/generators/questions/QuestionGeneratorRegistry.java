package com.example.generation_service.generators.questions;

import com.example.generation_service.models.generation.QuestionType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class QuestionGeneratorRegistry {

    private final Map<QuestionType, QuestionGenerator> questionGenerators;

    public QuestionGenerator getGenerator(final QuestionType type) {
        final QuestionGenerator generator = questionGenerators.get(type);
        if (generator == null) {
            throw new IllegalArgumentException("No generator found for type: " + type);
        }
        return generator;
    }

}
