package com.example.aitestgenerator.services;

import com.example.aitestgenerator.generators.AnswerGenerator;
import com.example.aitestgenerator.generators.QuestionGenerator;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.retry.backoff.FixedBackOffPolicy;
import org.springframework.retry.policy.SimpleRetryPolicy;
import org.springframework.retry.support.RetryTemplate;

import java.io.IOException;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TestGenerationServiceTest {

    private final static int maxAttempts = 2;

    @Mock
    private QuestionGenerator questionGenerator;

    @Mock
    private AnswerGenerator answerGenerator;

    private TestGenerationService service;

    private static RetryTemplate retryTemplate;

    @BeforeAll
    public static void init() {
        retryTemplate = new RetryTemplate();
        FixedBackOffPolicy fixedBackOffPolicy = new FixedBackOffPolicy();
        fixedBackOffPolicy.setBackOffPeriod(1000L);
        retryTemplate.setBackOffPolicy(fixedBackOffPolicy);

        SimpleRetryPolicy retryPolicy = new SimpleRetryPolicy();
        retryPolicy.setMaxAttempts(maxAttempts);
        retryTemplate.setRetryPolicy(retryPolicy);
    }

    @Test
    public void testGenerateQuestionsCheckRetry() throws IOException {
        // Инициализация сервиса
        service = new TestGenerationService(questionGenerator, answerGenerator, retryTemplate);

        // Мокирование внешнего вызова
        when(questionGenerator.generateData(any(), anyList())).thenThrow(new IOException());

        // Вызов и проверка исключения
        assertThrows(IOException.class, () -> service.generateQuestions(new TestGeneratingHistory()));

        // Проверка количества вызовов
        verify(questionGenerator, times(maxAttempts)).generateData(any(), anyList());
    }

    @Test
    public void testGenerateQuestions() throws IOException {
        // Инициализация сервиса
        service = new TestGenerationService(questionGenerator, answerGenerator, retryTemplate);

        // Мокирование внешнего вызова
        when(questionGenerator.generateData(any(), anyList())).thenReturn(new ArrayList<>());

        // Вызов и проверка исключения
        assertDoesNotThrow(() -> service.generateQuestions(new TestGeneratingHistory()));

        // Проверка количества вызовов
        verify(questionGenerator, times(1)).generateData(any(), anyList());
    }

    @Test
    public void testGenerateAnswersCheckRetry() throws IOException {
        service = new TestGenerationService(questionGenerator, answerGenerator, retryTemplate);

        when(answerGenerator.generateData(any(), anyList())).thenThrow(new IOException());

        assertThrows(IOException.class, () -> service.generateAnswers(new TestGeneratingHistory(), new ArrayList<>()));

        verify(answerGenerator, times(maxAttempts)).generateData(any(), anyList());
    }

    @Test
    public void testGenerateAnswers() throws IOException {
        service = new TestGenerationService(questionGenerator, answerGenerator, retryTemplate);

        when(answerGenerator.generateData(any(), anyList())).thenReturn(com.example.aitestgenerator.models.Test.builder().build());

        assertDoesNotThrow(() -> service.generateAnswers(new TestGeneratingHistory(), new ArrayList<>()));

        verify(answerGenerator, times(1)).generateData(any(), anyList());
    }
}
