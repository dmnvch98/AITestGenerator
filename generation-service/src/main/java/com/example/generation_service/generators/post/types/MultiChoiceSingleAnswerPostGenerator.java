package com.example.generation_service.generators.post.types;

import com.example.generation_service.converters.TestConverter;
import com.example.generation_service.dto.generation.GenerateTestAllAnswersResponseDto;
import com.example.generation_service.generators.models.GenerateTestRequestParams;
import com.example.generation_service.generators.post.PostGenerator;
import com.example.generation_service.models.generation.QuestionType;
import com.example.generation_service.models.test.Question;
import com.example.generation_service.models.test.Test;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MultiChoiceSingleAnswerPostGenerator extends PostGenerator {


    public MultiChoiceSingleAnswerPostGenerator(TestConverter testConverter) {
        super(testConverter);
    }

    @Override
    public Test process(GenerateTestAllAnswersResponseDto dto, GenerateTestRequestParams request) {
        final List<Question> questions = testConverter.convertAllAnswersQuestions(dto.getQuestions(), QuestionType.MULTIPLE_CHOICE_SINGLE_ANSWER);
        return testConverter.convert(
                questions, dto.getTitle(), request.getUserId(), request.getFileHash().getOriginalFilename());
    }

    @Override
    public QuestionType getTestQuestionsType() {
        return QuestionType.MULTIPLE_CHOICE_SINGLE_ANSWER;
    }
}
