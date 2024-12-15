package com.example.generation_service.generators.post.types;

import com.example.generation_service.converters.TestConverter;
import com.example.generation_service.dto.generation.GenerateTestCorrectAnswersResponseDto;
import com.example.generation_service.dto.generation.GenerateTestIncorrectAnswersResponseDto;
import com.example.generation_service.generators.models.GenerateTestRequestParams;
import com.example.generation_service.generators.post.PostGenerator;
import com.example.generation_service.models.generation.QuestionType;
import com.example.generation_service.models.test.Question;
import com.example.generation_service.models.test.Test;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MultiChoiceMultiAnswerPostGenerator extends PostGenerator {


    public MultiChoiceMultiAnswerPostGenerator(TestConverter testConverter) {
        super(testConverter);
    }

    @Override
    public Test process(GenerateTestIncorrectAnswersResponseDto incorrectAnswersDto, GenerateTestCorrectAnswersResponseDto correctAnswersDto, GenerateTestRequestParams request) {
        final List<Question> questions = testConverter.convertAllAnswersQuestions(incorrectAnswersDto, correctAnswersDto, QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWERS);

        return testConverter.convert(
                questions, correctAnswersDto.getTitle(), request.getUserId(), request.getFileHash().getOriginalFilename());
    }

    @Override
    public QuestionType getTestQuestionsType() {
        return QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWERS;
    }
}
