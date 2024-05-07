package com.example.aitestgenerator.services;

import com.example.aitestgenerator.holder.TestGeneratingHistoryHolder;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.enums.FailReason;
import com.example.aitestgenerator.models.enums.GenerationStatus;
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
    private final TestGeneratingHistoryService historyService;
    private final TestGeneratingHistoryHolder historyHolder;


    public Test start(TestGeneratingHistory history) {
        initializeHistory(history);

        List<ChatMessage> messages = new ArrayList<>();

        ChatCompletionResult questionsResult = generateQuestions(history, messages);
        String questions = extractAnswer(questionsResult);

        ChatCompletionResult testResult = generateTest(history, messages, questions);

        handleGenerationResults(history, testResult);

        return history.getTest();
    }

    private void initializeHistory(TestGeneratingHistory history) {
        log.info("Starting test generation. Text id: {}, User id: {}", history.getText().getId(), history.getUser().getId());

        history.setGenerationStart(getGMT());
        history.setGenerationStatus(GenerationStatus.IN_PROCESS);
        historyHolder.setHistory(history);
        historyService.save(history);
    }

    private void handleGenerationResults(TestGeneratingHistory history, ChatCompletionResult testResult) {
        log.info("Test generation completed. Text id: {}, User id: {}", history.getText().getId(), history.getUser().getId());
        Usage usage = testResult.getUsage();
        history.setInputTokensCount(usage.getPromptTokens());
        history.setOutputTokensCount(usage.getCompletionTokens());
        history.setGenerationEnd(getGMT());

        historyService.save(history);

        String testJson = extractAnswer(testResult);
        Test test = parseTest(testJson, history)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "Some error occurred when generating test. Please contact admin or try later"));

        history.setTest(test);
        history.setGenerationStatus(GenerationStatus.SUCCESS);

        historyService.save(history);
        historyHolder.clearHistory();
    }

    private ChatCompletionResult generateQuestions(TestGeneratingHistory history, List<ChatMessage> messages) {
        log.info("Generating Questions. Text id: {}, User id: {}", history.getText().getId(), history.getUser().getId());
        String questionsPrompt = readFileContents("ai_prompts/generate_questions.txt");
        String textWithoutHTML = removeHTMLTags(history.getText().toString());
        return generateData(messages, questionsPrompt, textWithoutHTML, history);
    }

    private ChatCompletionResult generateTest(TestGeneratingHistory history, List<ChatMessage> messages, String questions) {
        log.info("Generating Test. Text id: {}, User id: {}", history.getText().getId(), history.getUser().getId());
        String testPrompt = readFileContents("ai_prompts/generate_test.txt");
        return generateData(messages, testPrompt, questions, history);
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
            history.setFailReason(FailReason.PARSE_EXCEPTION);
        } finally {
            historyService.save(history);
        }
        return Optional.empty();
    }

    private ChatCompletionResult generateData(List<ChatMessage> messages, String request, String content, TestGeneratingHistory history) {
        ChatMessage taskPrompt = createChatMessage(request);
        ChatMessage textPrompt = createChatMessage(content);

        messages.add(taskPrompt);
        messages.add(textPrompt);

        log.info("Sending prompt to AI. Text id: {}, User id: {}", history.getText().getId(), history.getUser().getId());

        return openAiService.createChatCompletion(buildChatCompletionRequest(messages));

    }

    private String extractAnswer(ChatCompletionResult chatCompletionResult) {
        return chatCompletionResult
            .getChoices()
            .get(0)
            .getMessage()
            .getContent();
    }

    private ChatCompletionRequest buildChatCompletionRequest(List<ChatMessage> chatMessages) {
        int tokensCount = countTokens(chatMessages
            .stream()
            .map(ChatMessage::getContent)
            .collect(Collectors.joining()));

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