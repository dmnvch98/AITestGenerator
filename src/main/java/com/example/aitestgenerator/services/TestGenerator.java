package com.example.aitestgenerator.services;

import com.example.aitestgenerator.exceptions.exceptionHandler.HandleTimeoutException;
import com.example.aitestgenerator.models.GenerationStatus;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.Text;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.theokanning.openai.Usage;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.example.aitestgenerator.utils.Utils.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class TestGenerator {
    private final ObjectMapper objectMapper;
    private final OpenAiService openAiService;
    private final TestGeneratingHistoryService testGeneratingHistoryService;

    @HandleTimeoutException
    public Test start(Text text, TestGeneratingHistory history) {
        log.info("Starting test generation. Text id: {}, User id: {}", text.getId(), text.getUserId());

        history.setGenerationStart(getGMT());
        history.setGenerationStatus(GenerationStatus.IN_PROCESS);

        testGeneratingHistoryService.save(history);

        List<ChatMessage> messages = new ArrayList<>();

        log.info("Generating Questions. Text id: {}, User id: {}", text.getId(), text.getUserId());
        String questions = generateData(messages, readFileContents("ai_prompts/generate_questions.txt"), removeHTMLTags(text.toString()), text, history);

        log.info("Generating Test. Text id: {}, User id: {}", text.getId(), text.getUserId());
        String testJson = generateData(messages, readFileContents("ai_prompts/generate_test.txt"), questions, text, history);

        log.info("Test generation completed. Text id: {}, User id: {}", text.getId(), text.getUserId());

        Test test = parseTest(testJson, history)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "Some error occurred when generating test. Please contact admin"));

        history.setTest(test);
        history.setGenerationStatus(GenerationStatus.SUCCESS);

        testGeneratingHistoryService.save(history);

        return test;
    }

    private Optional<Test> parseTest(String json, TestGeneratingHistory history) {
        try {
            Test test = objectMapper.readValue(json, Test.class);
            if (test.getTitle() == null) {
                test.setTitle(history.getText().getTitle());
            }
            return Optional.of(test);
        } catch (JsonProcessingException e) {
            log.error("An error occurred when parsing test. UserId: {}, textId: {}, Error: {}",
                history.getUser().getId(), history.getText().getId(), e.getMessage());
            history.setGenerationStatus(GenerationStatus.FAILED);
        } finally {
            history.setOutputTokensCount(countTokens(json));
            history.setGenerationEnd(getGMT());
            testGeneratingHistoryService.save(history);
        }
        return Optional.empty();
    }

    private String generateData(List<ChatMessage> messages, String request, String content, Text text, TestGeneratingHistory history) {
        ChatMessage taskPrompt = createChatMessage(request);
        ChatMessage textPrompt = createChatMessage(content);

        messages.add(taskPrompt);
        messages.add(textPrompt);

        log.info("Sending prompt to AI. Text id: {}, User id: {}", text.getId(), text.getUserId());

        ChatCompletionResult chatCompletionResult = openAiService.createChatCompletion(buildChatCompletionRequest(messages, history));
//        Usage usage = chatCompletionResult.getUsage();
//
//        history.setInputTokensCount(usage.getPromptTokens());
//        history.setOutputTokensCount(usage.getCompletionTokens());

        return extractAnswer(chatCompletionResult);
    }

    private String extractAnswer(ChatCompletionResult chatCompletionResult) {
        return chatCompletionResult
            .getChoices()
            .get(0)
            .getMessage()
            .getContent();
    }

    private ChatCompletionRequest buildChatCompletionRequest(List<ChatMessage> chatMessages, TestGeneratingHistory history) {
        int tokensCount = countTokens(chatMessages
            .stream()
            .map(ChatMessage::getContent)
            .collect(Collectors.joining()));

        history.setInputTokensCount(tokensCount);

        int maxTokens = 16000 - tokensCount;

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