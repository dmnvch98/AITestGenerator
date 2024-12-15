package com.example.generation_service.generators.questions.types;

import com.example.generation_service.converters.GenerationConverter;
import com.example.generation_service.dto.generation.GenerateTestCorrectAnswersResponseDto;
import com.example.generation_service.generators.models.GenerateTestRequestParams;
import com.example.generation_service.generators.questions.QuestionGenerator;
import com.example.generation_service.models.generation.QuestionType;
import com.example.generation_service.services.ai.AIService;
import org.springframework.stereotype.Component;

@Component
public class MultiChoiceSingleAnswerGenerator extends QuestionGenerator {

    private final static String SCHEMA = "/ai/schemas/multiple_choise/questions.json";
    protected final static String CONTEXT = "/ai/question_context_prompt.txt";

    public MultiChoiceSingleAnswerGenerator(GenerationConverter converter, AIService aiService) {
        super(converter, aiService);
    }

    @Override
    public GenerateTestCorrectAnswersResponseDto generateData(
            final GenerateTestRequestParams request,
            final long timeout
    ) throws Exception {
        return super.generateData(request, timeout, SCHEMA);
    }

    @Override
    public QuestionType getTestQuestionsType() {
        return QuestionType.MULTIPLE_CHOICE_SINGLE_ANSWER;
    }
}
