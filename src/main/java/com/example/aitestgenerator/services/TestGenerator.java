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
        List<ChatMessage> messages = new ArrayList<>();

        String questions = generateData(messages, readFileContents("ai_prompts/generate_questions.txt"), text.toString());

        String testJson = generateData(messages, readFileContents("ai_prompts/generate_test.txt"), questions);

        return objectMapper.readValue(testJson, Test.class);
    }

    private String generateData(List<ChatMessage> messages, String request, String content) {
        ChatMessage taskPrompt = createChatMessage(request);
        ChatMessage textPrompt = createChatMessage(content);

        messages.add(taskPrompt);
        messages.add(textPrompt);

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
        int maxTokens = 16000 - countTokens(chatMessages.stream().map(ChatMessage::getContent).collect(Collectors.joining()));

        return ChatCompletionRequest.builder()
            .model("gpt-3.5-turbo-16k-0613")
            .messages(chatMessages)
            .maxTokens(maxTokens)
            .temperature(1.0)
            .topP(1.0)
            .build();
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

        ChatMessage responseMessage = openAiService.createChatCompletion(chatCompletionRequest).getChoices().get(0).getMessage();

        String newTestJson = responseMessage.getContent();

        return parseTestFromJson(newTestJson, textId);
    }

    private ChatMessage createChatMessage(String content) {
        ChatMessage message = new ChatMessage();
        message.setContent(content);
        message.setRole("user");
        return message;
    }

    @SneakyThrows
    private Test parseTestFromJson(String testJson, Long textId) {
        return objectMapper.readValue(testJson, Test.class);
    }

}
