package com.example.generation_service.config.generator;

import com.example.generation_service.generators.post.PostGenerator;
import com.example.generation_service.generators.questions.QuestionGenerator;
import com.example.generation_service.models.generation.QuestionType;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
public class GeneratorConfig {

    private final List<QuestionGenerator> questionGenerators;
    private final List<PostGenerator> postGenerators;

    @Bean
    public Map<QuestionType, QuestionGenerator> getQuestionGenerators() {
        return questionGenerators.stream()
                .collect(Collectors.toMap(QuestionGenerator::getTestQuestionsType, Function.identity()));
    }

    @Bean
    public Map<QuestionType, PostGenerator> getPostGenerators() {
        return postGenerators.stream()
                .collect(Collectors.toMap(PostGenerator::getTestQuestionsType, Function.identity()));
    }
}
