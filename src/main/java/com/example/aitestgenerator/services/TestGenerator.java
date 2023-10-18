package com.example.aitestgenerator.services;

import com.example.aitestgenerator.models.Question;
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
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.example.aitestgenerator.utils.Utils.countTokens;
import static com.example.aitestgenerator.utils.Utils.readFileContents;

@Component
@RequiredArgsConstructor
@Slf4j
public class TestGenerator {
    private final ObjectMapper objectMapper;
    private final OpenAiService openAiService;

    public Test start(Text text) {
        List<ChatMessage> messages = new ArrayList<>();
        List<List<String>> questionGroups = splitQuestionsIntoGroups(text, messages);

        List<CompletableFuture<Test>> futureTests = new ArrayList<>();

        for (List<String> group : questionGroups) {
            CompletableFuture<Test> futureTest = generateTestAsync(group, text, messages);
            futureTests.add(futureTest);
        }

        CompletableFuture<Void> allOf = CompletableFuture.allOf(futureTests.toArray(new CompletableFuture[0]));

        return allOf.thenApply(ignored -> {
            List<Question> generatedQuestions = new ArrayList<>();
            for (CompletableFuture<Test> futureTest : futureTests) {
                generatedQuestions.addAll(futureTest.join().getQuestions());
            }

            return Test.builder()
                .title(text.getTitle())
                .questions(generatedQuestions)
                .userId(text.getUserId())
                .build();
        }).join();
    }

    private CompletableFuture<Test> generateTestAsync(List<String> questionGroup, Text text, List<ChatMessage> messages) {
        return CompletableFuture.supplyAsync(() -> {
            log.info("Generating Test. Text id: {}, User id: {}. Questions: {}", text.getId(), text.getUserId(), questionGroup);
            String testJson = generateData(new ArrayList<>(messages), readFileContents("ai_prompts/generate_test.txt"), questionGroup.toString(), text);
            try {
                return objectMapper.readValue(testJson, Test.class);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        });
    }

    private List<List<String>> splitQuestionsIntoGroups(Text text, List<ChatMessage> messages) {
        log.info("Generating questions for text. Text id: {}, User id: {}", text.getId(), text.getUserId());
        String questions = generateData(messages, readFileContents("ai_prompts/generate_questions.txt"), text.toString(), text);
        return parseQuestionGroups(questions, text);
    }

    private List<List<String>> parseQuestionGroups(String questions, Text text) {
        log.info("Parsing questions from string. Text id: {}, User id: {}", text.getId(), text.getUserId());
        List<String> questionList = Arrays.asList(questions.split("\n"));
        int groupSize = 3;

        return IntStream.range(0, questionList.size())
            .filter(i -> i % groupSize == 0)
            .mapToObj(i -> questionList.subList(i, Math.min(i + groupSize, questionList.size())))
            .collect(Collectors.toList());
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
