package com.example.generation_service.services.generation;

import com.example.generation_service.dto.generation.GenerateTestCorrectAnswersResponseDto;
import com.example.generation_service.dto.generation.GenerateTestIncorrectAnswersResponseDto;
import com.example.generation_service.generators.IncorrectAnswerGenerator;
import com.example.generation_service.generators.models.GenerateTestRequestParams;
import com.example.generation_service.generators.post.PostGenerationRegistry;
import com.example.generation_service.generators.questions.QuestionGeneratorRegistry;
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

    private final QuestionGeneratorRegistry questionGeneratorRegistry;
    private final PostGenerationRegistry postGenerationRegistry;
    private final IncorrectAnswerGenerator answerGenerator;
    private final RetryTemplate retryTemplate;

  public Test generateTest(final GenerateTestRequestParams request, final Map<String, String> retryContextParamsMap)
      throws Exception {
    GenerateTestCorrectAnswersResponseDto correctAnswersDto = generateQuestions(request, retryContextParamsMap);
    log.info(
        "Question generation is done. User id: [{}], questions count: [{}]", request.getUserId(),
            correctAnswersDto.getQuestions().size());

    if (request.getQuestionsType().isShouldGenerateIncorrectOptions()) {
        GenerateTestIncorrectAnswersResponseDto incorrectAnswersDto = generateIncorrectOptions(request, correctAnswersDto, retryContextParamsMap);
        return postGenerationRegistry.getGenerator(request.getQuestionsType())
                .process(incorrectAnswersDto, correctAnswersDto, request);
    }

    return postGenerationRegistry.getGenerator(request.getQuestionsType())
            .process(correctAnswersDto, request);
  }

    public GenerateTestCorrectAnswersResponseDto generateQuestions(final GenerateTestRequestParams request, final Map<String, String> retryContextParamsMap) throws Exception {
      return retryTemplate.execute(context -> {
            setRetryContextParams(context, retryContextParamsMap);
            long timeout = calculateTimeout(context.getRetryCount());
            return questionGeneratorRegistry.getGenerator(request.getQuestionsType())
                    .generateData(request, timeout);
        });
    }

    public GenerateTestIncorrectAnswersResponseDto generateIncorrectOptions(final GenerateTestRequestParams request,
                                                                            final GenerateTestCorrectAnswersResponseDto questionsResponseDto,
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
