package com.example.generation_service.generators;

import com.example.generation_service.converters.GenerationConverter;
import com.example.generation_service.dto.generation.GenerateQuestionsResponseDto;
import com.example.generation_service.generators.models.GenerateTestRequest;
import com.example.generation_service.services.ai.AIService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import static com.example.generation_service.utils.Utils.*;

@Component
@Slf4j
@RequiredArgsConstructor
public class QuestionGenerator extends Generator<GenerateQuestionsResponseDto> {

    private static final String QUESTIONS_CONTEXT_PROMPT_FILE = "/ai/question_context_prompt.txt";
    private static final String QUESTIONS_SCHEMA_FILE = "/ai/schemas/questions.json";

    @Value("${generation.models.question}")
    private String model;

    private final GenerationConverter converter;
    private final AIService aiService;
    private final ObjectMapper objectMapper;

    @Override
    public GenerateQuestionsResponseDto generateData(final GenerateTestRequest request, final long timeout) throws Exception {
        log.info("Sending prompt to generation questions. User id: {}, timeout: {}", request.getUserId(), timeout);

        try (final InputStream in = getClass().getResourceAsStream(QUESTIONS_SCHEMA_FILE);
             final BufferedReader reader = new BufferedReader(new InputStreamReader(in))) {
            final String content = reader.lines().collect(Collectors.joining("\n"));
            final JsonNode responseSchema = objectMapper.readTree(content);

            final List<ChatMessage> chatMessages = prepareMessages(request);
            final String result = aiService.send(model, chatMessages, responseSchema, request.getTemperature(), request.getTopP(), timeout);
            return converter.convert(result);
        }
    }

    private List<ChatMessage> prepareMessages(final GenerateTestRequest request) {
        try (InputStream in = getClass().getResourceAsStream(QUESTIONS_CONTEXT_PROMPT_FILE);
             BufferedReader reader = new BufferedReader(new InputStreamReader(in))) {
            String contextPrompt = reader.lines().collect(Collectors.joining("\n"));
            String userPrompt = converter.convert(request);

            final ChatMessage context = new ChatMessage(ChatMessageRole.SYSTEM.value(), contextPrompt);
            final ChatMessage userText = new ChatMessage(ChatMessageRole.USER.value(), userPrompt);

            return List.of(context, userText);
        } catch (IOException e) {
            throw new RuntimeException("Error reading resource file: " + QUESTIONS_CONTEXT_PROMPT_FILE, e);
        }
    }


}
