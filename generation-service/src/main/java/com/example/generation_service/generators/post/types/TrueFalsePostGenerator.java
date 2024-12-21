package com.example.generation_service.generators.post.types;

import com.example.generation_service.converters.TestConverter;
import com.example.generation_service.dto.generation.GenerateTestCorrectAnswersResponseDto;
import com.example.generation_service.generators.models.GenerateTestRequestParams;
import com.example.generation_service.generators.post.PostGenerator;
import com.example.generation_service.models.generation.QuestionType;
import com.example.generation_service.models.test.AnswerOption;
import com.example.generation_service.models.test.Question;
import com.example.generation_service.models.test.Test;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class TrueFalsePostGenerator extends PostGenerator {

    public TrueFalsePostGenerator(TestConverter testConverter) {
        super(testConverter);
    }

    @Override
    public Test process(final GenerateTestCorrectAnswersResponseDto dto, final GenerateTestRequestParams request) {
        final List<Question> questions = dto.getQuestions()
                .stream()
                .map(TrueFalsePostGenerator::convertToQuestionDto)
                .toList();

        return testConverter.convert(questions, dto.getTitle(), request.getUserId(), request.getFileHash().getOriginalFilename());
    }

    @Override
    public QuestionType getTestQuestionsType() {
        return QuestionType.TRUE_FALSE;
    }

    private static Question convertToQuestionDto(GenerateTestCorrectAnswersResponseDto.QuestionDto source) {
        if (!(source.getCorrectAnswers().get(0) instanceof Boolean)) {
            throw new IllegalArgumentException("Answer in source QuestionDto must be of type Boolean");
        }

        boolean originalAnswer = (Boolean) source.getCorrectAnswers().get(0);

        final AnswerOption correctOption = AnswerOption.builder()
                .optionText("Верно")
                .correct(originalAnswer)
                .build();

        final AnswerOption incorrectOption = AnswerOption.builder()
                .optionText("Неверно")
                .correct(!originalAnswer)
                .build();

        return Question.builder()
                .questionText(source.getQuestionText())
                .answerOptions(Arrays.asList(correctOption, incorrectOption))
                .questionType(QuestionType.TRUE_FALSE)
                .textReference(source.getTextReference())
                .build();
    }

}
