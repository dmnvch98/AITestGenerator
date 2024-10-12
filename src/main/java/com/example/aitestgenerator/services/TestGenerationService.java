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
import org.springframework.core.AttributeAccessor;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@AllArgsConstructor
@Service
@Slf4j
public class TestGenerationService {

    private final QuestionGenerator questionGenerator;
    private final AnswerGenerator answerGenerator;
    private final RetryTemplate retryTemplate;
    private final TestConverter testConverter;

    public Test generateTest(final GenerateTestRequest request, Map<String, String> retryContextParamsMap) {
      final GenerateQuestionsResponseDto questionsResponseDto = generateQuestions(request, retryContextParamsMap);
      final GenerateAnswersResponseDto answersResponseDto = generateAnswers(request, questionsResponseDto, retryContextParamsMap);

      return testConverter.convert(answersResponseDto, questionsResponseDto.getProblems(), request.getUserId(), request.getFileHash());
    }

    public GenerateQuestionsResponseDto generateQuestions(final GenerateTestRequest request, Map<String, String> retryContextParamsMap) {
        try {
            return retryTemplate.execute(context -> {
                setRetryContextParams(context, retryContextParamsMap);
                return questionGenerator.generateData(request);
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
                return answerGenerator.generateData(request, questionsResponseDto);
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

}
