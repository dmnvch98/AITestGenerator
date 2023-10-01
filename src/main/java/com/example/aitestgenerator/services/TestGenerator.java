package com.example.aitestgenerator.services;

import com.example.aitestgenerator.dto.tests.GenerateAdditionalTestDto;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.models.Text;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import static com.example.aitestgenerator.utils.Utils.countTokens;
import static com.example.aitestgenerator.utils.Utils.readFileContents;

@Component
@RequiredArgsConstructor
@Slf4j
public class TestGenerator {
    private final ObjectMapper objectMapper;
    private final OpenAiService openAiService;

    public Test generateTest(Text text) throws JsonProcessingException {
        String request = readFileContents("ai_prompts/generate_test.txt");

        ChatCompletionRequest chatCompletionRequest = buildChatCompletionRequest(request, text);

        ChatCompletionResult chatCompletionResult = openAiService.createChatCompletion(chatCompletionRequest);

        String testJson = chatCompletionResult.getChoices().get(0).getMessage().getContent();

        return parseTestFromJson(testJson, text.getId());
    }

    public Test generateAdditionalTest(GenerateAdditionalTestDto testDto, Long textId) throws JsonProcessingException {
        List<ChatMessage> messages = new ArrayList<>();

        String request = readFileContents("ai_prompts/generate_additional_test.txt");

        ChatMessage taskPrompt = createChatMessage(request);

        String testJson = objectMapper.writeValueAsString(testDto);
        ChatMessage existingTest = createChatMessage(testJson);

        messages.add(taskPrompt);
        messages.add(existingTest);

        int maxTokens = 16000 - countTokens(request + testJson);

        ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()
            .model("gpt-3.5-turbo-16k")
            .messages(messages)
            .maxTokens(maxTokens)
            .build();

        ChatCompletionResult chatCompletionResult = openAiService.createChatCompletion(chatCompletionRequest);

        String newTestJson = chatCompletionResult.getChoices().get(0).getMessage().getContent();

        return parseTestFromJson(newTestJson, textId);
    }

    private ChatCompletionRequest buildChatCompletionRequest(String request, Text text) {
        List<ChatMessage> messages = new ArrayList<>();

        ChatMessage taskPrompt = createChatMessage(request);
        ChatMessage userTextPrompt = createChatMessage(text.toString());

        messages.add(taskPrompt);
        messages.add(userTextPrompt);

        int maxTokens = 16000 - countTokens(request + userTextPrompt);

        return ChatCompletionRequest.builder()
            .model("gpt-3.5-turbo-16k")
            .messages(messages)
            .maxTokens(maxTokens)
            .build();
    }

    private ChatMessage createChatMessage(String content) {
        ChatMessage message = new ChatMessage();
        message.setContent(content);
        message.setRole("user");
        return message;
    }

    private Test parseTestFromJson(String testJson, Long textId) throws JsonProcessingException {
        log.info("Parsing test from JSON. Text id: {}", textId);

        Test test = objectMapper.readValue(testJson, Test.class);

        test.getQuestions().forEach(question -> {
            question.setTest(test);
            question.getAnswerOptions().forEach(answerOption -> answerOption.setQuestion(question));
        });

        log.info("Test parsing for text is completed. Text id: {}", textId);

        return test;
    }

}
