package com.example.generation_service.generators.questions.types;

import com.example.generation_service.converters.GenerationConverter;
import com.example.generation_service.dto.generation.GenerateTestCorrectAnswersResponseDto;
import com.example.generation_service.generators.models.GenerateTestRequestParams;
import com.example.generation_service.generators.questions.QuestionGenerator;
import com.example.generation_service.models.generation.QuestionType;
import com.example.generation_service.services.ai.AIService;
import org.springframework.stereotype.Component;

@Component
public class FillBlanksAnswerGenerator extends QuestionGenerator {

    private final static String SCHEMA = "/ai/schemas/multiple_choise/questions.json";
    private final static QuestionType QUESTION_TYPE = QuestionType.FILL_IN_THE_BLANKS;


    public FillBlanksAnswerGenerator(GenerationConverter converter, AIService aiService) {
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
        return QUESTION_TYPE;
    }
}
