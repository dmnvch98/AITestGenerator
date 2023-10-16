package com.example.aitestgenerator.services;

import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.models.Text;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.example.aitestgenerator.utils.Utils.countTokens;
import static com.example.aitestgenerator.utils.Utils.readFileContents;

@Component
@RequiredArgsConstructor
@Slf4j
public class TestGenerator {
    private final ObjectMapper objectMapper;
    private final OpenAiService openAiService;

    @SneakyThrows
    public Test start(Text text) {
        log.info("Starting test generation. Text id: {}, User id: {}", text.getId(), text.getUserId());

        List<ChatMessage> messages = new ArrayList<>();

        log.info("Generating Questions. Text id: {}, User id: {}", text.getId(), text.getUserId());
        String questions = generateData(messages, readFileContents("ai_prompts/generate_questions.txt"), text.toString(), text);

        log.info("Generating Test. Text id: {}, User id: {}", text.getId(), text.getUserId());
        String testJson = generateData(messages, readFileContents("ai_prompts/generate_test.txt"), questions, text);

        Test test = objectMapper.readValue(testJson, Test.class);

        log.info("Test generation completed. Text id: {}, User id: {}", text.getId(), text.getUserId());

        return test;
    }

    private String generateData(List<ChatMessage> messages, String request, String content, Text text) {
        ChatMessage taskPrompt = createChatMessage(request);
        ChatMessage textPrompt = createChatMessage(content);

        messages.add(taskPrompt);
        messages.add(textPrompt);

        log.info("Sending prompt to AI. Text id: {}, User id: {}", text.getId(), text.getUserId());

        ChatCompletionResult chatCompletionResult = openAiService.createChatCompletion(buildChatCompletionRequest(messages));

        return extractAnswer(chatCompletionResult);
    }

    private String extractAnswer(ChatCompletionResult chatCompletionResult) {
        return chatCompletionResult
            .getChoices()
            .get(0)
            .getMessage()
            .getContent();
    }

    private ChatCompletionRequest buildChatCompletionRequest(List<ChatMessage> chatMessages) {
        int maxTokens = 16000 - countTokens(chatMessages
            .stream()
            .map(ChatMessage::getContent)
            .collect(Collectors.joining()));

        return ChatCompletionRequest.builder()
            .model("gpt-3.5-turbo-16k-0613")
            .messages(chatMessages)
            .maxTokens(maxTokens)
            .temperature(1.0)
            .topP(1.0)
            .build();
    }

    private ChatMessage createChatMessage(String content) {
        ChatMessage message = new ChatMessage();
        message.setContent(content);
        message.setRole("user");
        return message;
    }
}
