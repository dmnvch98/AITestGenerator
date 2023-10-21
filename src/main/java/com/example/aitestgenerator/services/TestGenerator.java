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
import lombok.*;
import lombok.extern.jackson.Jacksonized;
import lombok.extern.slf4j.Slf4j;
import one.util.streamex.StreamEx;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import static com.example.aitestgenerator.utils.Utils.countTokens;
import static com.example.aitestgenerator.utils.Utils.readFileContents;

@Component
@RequiredArgsConstructor
@Slf4j
public class TestGenerator {
    private final ObjectMapper objectMapper;
    private final OpenAiService openAiService;
    @Value("${generate-test.questions_group_size}")
    public int questionsGroupSize;

    public Test start(Text text) {
        List<CompletableFuture<QuestionsDto>> futureQuestions = splitQuestionsIntoGroups(text)
            .stream()
            .map(group -> generateTestAsync(group, text))
            .toList();

        List<Question> generatedQuestions = CompletableFuture.allOf(futureQuestions.toArray(new CompletableFuture[0]))
            .thenApply(ignored -> futureQuestions.stream()
                .map(CompletableFuture::join)
                .map(QuestionsDto::getQuestions)
                .flatMap(Collection::stream)
                .toList())
            .join();

        return Test.builder()
            .title(text.getTitle())
            .questions(generatedQuestions)
            .userId(text.getUserId())
            .build();
    }

    private CompletableFuture<QuestionsDto> generateTestAsync(List<String> questionGroup, Text text) {
        return CompletableFuture.supplyAsync(() -> {
            log.info("Generating Test. Text id: {}, User id: {}. Questions: {}", text.getId(), text.getUserId(), questionGroup);
            TestDto testDto = new TestDto(text.getContent(), questionGroup);
            String testJson = generateData(readFileContents("ai_prompts/generate_test.txt"), testDto.toString());
            try {
                return objectMapper.readValue(testJson, QuestionsDto.class);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        });
    }

    private List<List<String>> splitQuestionsIntoGroups(Text text) {
        log.info("Generating questions for text. Text id: {}, User id: {}", text.getId(), text.getUserId());
        String questions = generateData(readFileContents("ai_prompts/generate_questions.txt"), text.getContent());
        return parseQuestionGroups(questions, text);
    }

    private List<List<String>> parseQuestionGroups(String questions, Text text) {
        log.info("Parsing questions from string. Text id: {}, User id: {}", text.getId(), text.getUserId());
        List<String> questionList = Arrays.asList(questions.split("\n"));

        return StreamEx.ofSubLists(questionList, questionsGroupSize)
            .toList();
    }

    private String generateData(String request, String content) {
        List<ChatMessage> messages = new ArrayList<>();
        ChatMessage textPrompt = createChatMessage(content);
        ChatMessage taskPrompt = createChatMessage(request);

        messages.add(textPrompt);
        messages.add(taskPrompt);

        log.info("Sending prompt to AI");

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
            .build();
    }

    private ChatMessage createChatMessage(String content) {
        ChatMessage message = new ChatMessage();
        message.setContent(content);
        message.setRole("user");
        return message;
    }

    @Jacksonized
    @Builder
    @lombok.Value
    static class QuestionsDto {
        List<Question> questions;
    }


    @AllArgsConstructor
    @lombok.Value
    static class TestDto {
        String textContent;
        List<String> questions;
        @Override
        public String toString() {
            return "text='" + textContent +
                "\nquestions=" + String.join(" ", questions);
        }
    }
}
