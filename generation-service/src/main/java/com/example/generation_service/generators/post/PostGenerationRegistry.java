package com.example.generation_service.generators.post;

import com.example.generation_service.models.generation.QuestionType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class PostGenerationRegistry {

    private final Map<QuestionType, PostGenerator> postGenerators;

    public PostGenerator getGenerator(final QuestionType type) {
        final PostGenerator generator = postGenerators.get(type);
        if (generator == null) {
            throw new IllegalArgumentException("No post generator found for type: " + type);
        }
        return generator;
    }
}
