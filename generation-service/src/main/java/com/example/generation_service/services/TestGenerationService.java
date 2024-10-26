package com.example.generation_service.services;

import com.example.generation_service.converters.TestConverter;
import com.example.generation_service.dto.generation.GenerateQuestionsResponseDto;
import com.example.generation_service.dto.generation.GenerateAnswersResponseDto;
import com.example.generation_service.generators.QuestionGenerator;
import com.example.generation_service.generators.AnswerGenerator;
import com.example.generation_service.generators.models.GenerateTestRequest;
import com.example.generation_service.models.Test;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.AttributeAccessor;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@AllArgsConstructor
@Service
@Slf4j
public class TestGenerationService {

    private final static int initialTimeout = 100000;
    private final static double timeoutMultiplier = 1.5;

    private final QuestionGenerator questionGenerator;
    private final AnswerGenerator answerGenerator;
    private final RetryTemplate retryTemplate;
    private final TestConverter testConverter;

    public Test generateTest(final GenerateTestRequest request, final Map<String, String> retryContextParamsMap) {
      final GenerateQuestionsResponseDto questionsResponseDto = generateQuestions(request, retryContextParamsMap);
      final GenerateAnswersResponseDto answersResponseDto = generateAnswers(request, questionsResponseDto, retryContextParamsMap);

      return testConverter.convert(answersResponseDto, questionsResponseDto.getProblems(), request.getUserId(), request.getFileHash());
    }

    public GenerateQuestionsResponseDto generateQuestions(final GenerateTestRequest request, final Map<String, String> retryContextParamsMap) {
        try {
            return retryTemplate.execute(context -> {
                setRetryContextParams(context, retryContextParamsMap);
                long timeout = calculateTimeout(context.getRetryCount());
                return questionGenerator.generateData(request, timeout);
            });
        } catch (final Exception e) {
            throw new RuntimeException("Questions generation failed for userId = " + request.getUserId() +
                    " fileHash = " + request.getFileHash());
        }
    }

    public GenerateAnswersResponseDto generateAnswers(final GenerateTestRequest request,
                                                      final GenerateQuestionsResponseDto questionsResponseDto,
                                                      final Map<String, String> retryContextParamsMap
                                                      ) {
        try {
            return retryTemplate.execute(context -> {
                setRetryContextParams(context, retryContextParamsMap);
                long timeout = calculateTimeout(context.getRetryCount());
                return answerGenerator.generateData(request, questionsResponseDto, timeout);
            });
        } catch (final Exception e) {
            throw new RuntimeException("Generation of answers failed for userId = " + request.getUserId() +
                  " fileHash = " + request.getFileHash());
        }
    }

    private void setRetryContextParams(final AttributeAccessor context, final Map<String, String> retryContextParamsMap) {
        for (Map.Entry<String, String> entry : retryContextParamsMap.entrySet()) {
            context.setAttribute(entry.getKey(), entry.getValue());
        }
    }

    private long calculateTimeout(int retryCount) {
        return (long) (initialTimeout * Math.pow(timeoutMultiplier, retryCount));
    }

}
