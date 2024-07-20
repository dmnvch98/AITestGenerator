package com.example.aitestgenerator.services;

import com.example.aitestgenerator.generators.QuestionGenerator;
import com.example.aitestgenerator.generators.AnswerGenerator;
import com.example.aitestgenerator.generators.models.GenerateTestRequest;
import com.example.aitestgenerator.models.Test;
import com.theokanning.openai.completion.chat.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
@Slf4j
public class TestGenerationService {

    private final QuestionGenerator questionGenerator;
    private final AnswerGenerator answerGenerator;
    private final RetryTemplate retryTemplate;

    public Test generateTest(final GenerateTestRequest request) {
        generateQuestions(request);
        return generateAnswers(request);
    }

    public List<ChatMessage> generateQuestions(final GenerateTestRequest request) {
        try {
            return retryTemplate.execute(context -> {
                context.setAttribute("historyId", request.getHistory().getId());
                return questionGenerator.generateData(request);
            });
        } catch (final Exception e) {
            return List.of();
        }
    }

    public Test generateAnswers(final GenerateTestRequest request) {
        try {
            return retryTemplate.execute(context -> {
                context.setAttribute("historyId", request.getHistory().getId());
                return answerGenerator.generateData(request);
            });
        } catch (final Exception e) {
            return Test.builder().build();
        }
    }

}
