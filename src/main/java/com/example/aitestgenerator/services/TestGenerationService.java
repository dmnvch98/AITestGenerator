package com.example.aitestgenerator.services;

import com.example.aitestgenerator.generators.QuestionGenerator;
import com.example.aitestgenerator.generators.AnswerGenerator;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.theokanning.openai.completion.chat.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
public class TestGenerationService {

    private final QuestionGenerator questionGenerator;
    private final AnswerGenerator answerGenerator;
    private final RetryTemplate retryTemplate;

    public Test generateTest(TestGeneratingHistory history) {
        List<ChatMessage> messages = generateQuestions(history);
        return generateAnswers(history, messages);
    }

    @SneakyThrows
    public List<ChatMessage> generateQuestions(TestGeneratingHistory history) {
        return retryTemplate.execute(arg0 -> questionGenerator.generateData(history, new ArrayList<>()));
    }

    @SneakyThrows
    public Test generateAnswers(TestGeneratingHistory history, List<ChatMessage> messages) {
        return retryTemplate.execute(arg0 -> answerGenerator.generateData(history, messages));
    }

}
