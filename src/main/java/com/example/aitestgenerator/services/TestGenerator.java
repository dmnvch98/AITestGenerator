package com.example.aitestgenerator.services;

import com.example.aitestgenerator.models.Chapter;
import com.example.aitestgenerator.models.Test;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.example.aitestgenerator.utils.Utils.countTokens;
import static com.example.aitestgenerator.utils.Utils.readFileContents;

@Component
@RequiredArgsConstructor
@Slf4j
public class TestGenerator {
    private final ObjectMapper objectMapper;
    private final OpenAiService openAiService;

    public Test generateTest(Chapter chapter, Integer minQuestionNumber, Integer maxQuestionNumber) throws JsonProcessingException {
        String request = readFileContents("ai_prompts/generate_test.txt");

        log.info("Generating test for chapter '{}', min question number: {}, max question number: {}", chapter.toString(), minQuestionNumber, maxQuestionNumber);

        ChatCompletionRequest chatCompletionRequest = buildChatCompletionRequest(request, chapter.toString(), minQuestionNumber, maxQuestionNumber);

        ChatCompletionResult chatCompletionResult = openAiService.createChatCompletion(chatCompletionRequest);

        String testJson = chatCompletionResult.getChoices().get(0).getMessage().getContent();

        return parseTestFromJson(testJson);
    }

    private ChatCompletionRequest buildChatCompletionRequest(String request, String chapter, Integer minQuestionNumber, Integer maxQuestionNumber) {
        ChatMessage taskPrompt = createChatMessage(request, "user");
        ChatMessage userTextPrompt = createChatMessage(chapter, "user");
        ChatMessage questionNumberPrompt = createChatMessage("Минимальное количество вопросов " + minQuestionNumber
            + "\n Максимальное число вопросов " + maxQuestionNumber, "user");

        int maxTokens = 8000 - countTokens(request + userTextPrompt);
        return ChatCompletionRequest.builder()
            .model("gpt-3.5-turbo-16k")
            .messages(List.of(taskPrompt, userTextPrompt, questionNumberPrompt))
            .maxTokens(maxTokens)
            .temperature(0.5)
            .build();
    }

    private ChatMessage createChatMessage(String content, String role) {
        ChatMessage message = new ChatMessage();
        message.setContent(content);
        message.setRole(role);
        return message;
    }

    private Test parseTestFromJson(String testJson) throws JsonProcessingException {
        log.info("Parsing test from JSON...");

        Test test = objectMapper.readValue(testJson, Test.class);

        test.getQuestions().forEach(question -> {
            question.setTest(test);
            question.getAnswerOptions().forEach(answerOption -> answerOption.setQuestion(question));
        });

        log.info("Test parsing complete.");

        return test;
    }

}
