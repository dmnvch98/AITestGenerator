package com.example.generation_service.services.generation;

import com.example.generation_service.converters.TestConverter;
import com.example.generation_service.dto.generation.GenerateQuestionsResponseDto;
import com.example.generation_service.dto.tests.AnswerOptionDto;
import com.example.generation_service.dto.tests.QuestionDto;
import com.example.generation_service.generators.models.GenerateTestRequestParams;
import com.example.generation_service.models.test.Test;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostGenerationService {

    private final TestConverter testConverter;

    public Test postGenerateTest(final GenerateQuestionsResponseDto dto, final GenerateTestRequestParams request) {
        switch (request.getQuestionsType()) {
            case TRUE_FALSE -> {
                return postGenerateTrueFalseType(dto, request);
            }
            case FILL_IN_THE_BLANKS -> {
                return postGenerateFillInBlanksType(dto, request);
            }
        }
        return null;
    }

    private Test postGenerateFillInBlanksType(final GenerateQuestionsResponseDto dto, final GenerateTestRequestParams request) {
        final List<QuestionDto> questionDtos = dto.getQuestions()
                .stream()
                .map(PostGenerationService::convertFillInMissedTypeQuestion)
                .toList();

        return testConverter.convert(questionDtos, dto.getTitle(), request.getUserId(), request.getFileHash().getOriginalFilename(), request.getQuestionsType());
    }

    private Test postGenerateTrueFalseType(final GenerateQuestionsResponseDto dto, final GenerateTestRequestParams request) {
        final List<QuestionDto> questionDtos = dto.getQuestions()
                .stream()
                .map(PostGenerationService::convertToQuestionDto)
                .toList();

        return testConverter.convert(questionDtos, dto.getTitle(), request.getUserId(), request.getFileHash().getOriginalFilename(), request.getQuestionsType());
    }

    private static QuestionDto convertToQuestionDto(GenerateQuestionsResponseDto.QuestionDto source) {
        if (!(source.getAnswer() instanceof Boolean)) {
            throw new IllegalArgumentException("Answer in source QuestionDto must be of type Boolean");
        }

        boolean originalAnswer = (Boolean) source.getAnswer();

        final AnswerOptionDto correctOption = AnswerOptionDto.builder()
                .optionText("Верно")
                .isCorrect(originalAnswer)
                .build();

        final AnswerOptionDto incorrectOption = AnswerOptionDto.builder()
                .optionText("Неверно")
                .isCorrect(!originalAnswer)
                .build();

        return QuestionDto.builder()
                .questionText(source.getQuestionText())
                .answerOptions(Arrays.asList(correctOption, incorrectOption))
                .textReference(source.getTextReference())
                .build();
    }

    private static QuestionDto convertFillInMissedTypeQuestion(GenerateQuestionsResponseDto.QuestionDto source) {
        if (!(source.getAnswer() instanceof String answer)) {
            throw new IllegalArgumentException("Answer in source QuestionDto must be of type String");
        }

        final AnswerOptionDto correctOption = AnswerOptionDto.builder()
                .optionText(answer)
                .isCorrect(true)
                .build();

        return QuestionDto.builder()
                .questionText(source.getQuestionText())
                .answerOptions(Collections.singletonList(correctOption))
                .textReference(source.getTextReference())
                .build();
    }
}
