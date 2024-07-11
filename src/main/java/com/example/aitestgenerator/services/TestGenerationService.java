package com.example.aitestgenerator.services;

import com.example.aitestgenerator.generators.QuestionGenerator;
import com.example.aitestgenerator.generators.AnswerGenerator;
import com.example.aitestgenerator.generators.models.GenerateTestRequest;
import com.example.aitestgenerator.models.Test;
import com.theokanning.openai.completion.chat.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class TestGenerationService {

    private final QuestionGenerator questionGenerator;
    private final AnswerGenerator answerGenerator;
    private final RetryTemplate retryTemplate;

    public Test generateTest(final GenerateTestRequest request) {
        generateQuestions(request);
        return generateAnswers(request);
    }

    @SneakyThrows
    public List<ChatMessage> generateQuestions(final GenerateTestRequest request) {
        return retryTemplate.execute(arg0 -> questionGenerator.generateData(request));
    }

    @SneakyThrows
    public Test generateAnswers(final GenerateTestRequest request) {
        return retryTemplate.execute(arg0 -> answerGenerator.generateData(request));
    }

}
