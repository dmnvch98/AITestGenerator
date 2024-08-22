package com.example.aitestgenerator.services;

import com.example.aitestgenerator.converters.TestConverter;
import com.example.aitestgenerator.dto.generation.GenerateQuestionsResponseDto;
import com.example.aitestgenerator.dto.generation.GenerateAnswersResponseDto;
import com.example.aitestgenerator.generators.QuestionGenerator;
import com.example.aitestgenerator.generators.AnswerGenerator;
import com.example.aitestgenerator.generators.models.GenerateTestRequest;
import com.example.aitestgenerator.models.Test;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
@Slf4j
public class TestGenerationService {

    private final QuestionGenerator questionGenerator;
    private final AnswerGenerator answerGenerator;
    private final RetryTemplate retryTemplate;
    private final TestConverter testConverter;

    public Test generateTest(final GenerateTestRequest request) {
        final GenerateQuestionsResponseDto questionsResponseDto = generateQuestions(request);
        final GenerateAnswersResponseDto answersResponseDto = generateAnswers(request, questionsResponseDto);

        final Test test = testConverter.convert(answersResponseDto, questionsResponseDto.getProblems(), request.getUserId(), request.getFileHash());
        log.info("Test generation is done. File hash=[{}], userId=[{}]", request.getFileHash().getHashedFilename(), request.getUserId());
        return test;
    }

    public GenerateQuestionsResponseDto generateQuestions(final GenerateTestRequest request) {
        try {
            return retryTemplate.execute(context -> {
                context.setAttribute("historyId", request.getHistory().getId());
                return questionGenerator.generateData(request);
            });
        } catch (final Exception e) {
            throw new RuntimeException("Questions generation failed for userId = " + request.getHistory().getUser().getId() +
                    " historyId = " + request.getHistory().getId());
        }
    }

    public GenerateAnswersResponseDto generateAnswers(final GenerateTestRequest request,
                                                      final GenerateQuestionsResponseDto questionsResponseDto) {
        try {
            return retryTemplate.execute(context -> {
                context.setAttribute("historyId", request.getHistory().getId());
                return answerGenerator.generateData(request, questionsResponseDto);
            });
        } catch (final Exception e) {
            throw new RuntimeException("Generation of answers for history id " + request.getHistory().getId() +
                    " failed");
        }
    }

}
