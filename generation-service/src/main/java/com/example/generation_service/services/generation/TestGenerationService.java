package com.example.generation_service.services.generation;

import com.example.generation_service.converters.TestConverter;
import com.example.generation_service.dto.generation.GenerateQuestionsResponseDto;
import com.example.generation_service.dto.generation.GenerateAnswersResponseDto;
import com.example.generation_service.generators.QuestionGenerator;
import com.example.generation_service.generators.AnswerGenerator;
import com.example.generation_service.generators.models.GenerateTestRequestParams;
import com.example.generation_service.models.test.Test;
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

    private final static int initialTimeout = 60000;
    private final static double timeoutMultiplier = 1.5;

    private final QuestionGenerator questionGenerator;
    private final AnswerGenerator answerGenerator;
    private final RetryTemplate retryTemplate;
    private final TestConverter testConverter;
    private final PostGenerationService postGenerationService;

  public Test generateTest(final GenerateTestRequestParams request, final Map<String, String> retryContextParamsMap)
      throws Exception {
    final GenerateQuestionsResponseDto questionsResponseDto = generateQuestions(request, retryContextParamsMap);
    log.info(
        "Question generation is done. User id: [{}], questions count: [{}]", request.getUserId(),
        questionsResponseDto.getQuestions().size());

    if (!request.getQuestionsType().isShouldGenerateIncorrectAnswers()) {
        return postGenerationService.postGenerateTest(questionsResponseDto, request);
    }
    final GenerateAnswersResponseDto answersResponseDto = generateAnswers(
        request, questionsResponseDto, retryContextParamsMap);
    log.info(
        "Test generation is done. User id: {}, questions count: [{}]", request.getUserId(),
        answersResponseDto.getQuestions().size());
    final Test test = testConverter.convert(
        answersResponseDto, request.getUserId(), request.getFileHash(), request.getQuestionsType());
    return test;
  }

    public GenerateQuestionsResponseDto generateQuestions(final GenerateTestRequestParams request, final Map<String, String> retryContextParamsMap) throws Exception {
        return retryTemplate.execute(context -> {
            setRetryContextParams(context, retryContextParamsMap);
            long timeout = calculateTimeout(context.getRetryCount());
            return questionGenerator.generateData(request, timeout);
        });
    }

    public GenerateAnswersResponseDto generateAnswers(final GenerateTestRequestParams request,
                                                      final GenerateQuestionsResponseDto questionsResponseDto,
                                                      final Map<String, String> retryContextParamsMap
                                                      ) throws Exception {
        return retryTemplate.execute(context -> {
            setRetryContextParams(context, retryContextParamsMap);
            long timeout = calculateTimeout(context.getRetryCount());
            return answerGenerator.generateData(request, questionsResponseDto, timeout);
        });
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
