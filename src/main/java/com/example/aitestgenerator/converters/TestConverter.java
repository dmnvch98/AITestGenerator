package com.example.aitestgenerator.converters;

import com.example.aitestgenerator.dto.tests.AnswerOptionDto;
import com.example.aitestgenerator.dto.tests.QuestionDto;
import com.example.aitestgenerator.dto.tests.GenerateAdditionalTestDto;
import com.example.aitestgenerator.models.AnswerOption;
import com.example.aitestgenerator.models.Test;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper
public abstract class TestConverter {
    public abstract AnswerOptionDto answerOptionToDto(AnswerOption answerOption);

    public GenerateAdditionalTestDto testToDto(List<Test> tests, String title) {
        List<QuestionDto> questionDtos = tests
            .stream()
            .flatMap(test -> test.getQuestions().stream())
            .map(question -> {
                List<AnswerOptionDto> answerOptionDtos = question.getAnswerOptions()
                    .stream()
                    .map(this::answerOptionToDto)
                    .toList();
                return new QuestionDto(question.getQuestionText(), answerOptionDtos);
            })
            .toList();
        return new GenerateAdditionalTestDto(title, questionDtos);
    }


}
