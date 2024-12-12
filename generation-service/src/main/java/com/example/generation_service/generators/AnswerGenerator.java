package com.example.generation_service.generators;

import com.example.generation_service.converters.GenerationConverter;
import com.example.generation_service.dto.generation.GenerateQuestionsResponseDto;
import com.example.generation_service.dto.generation.GenerateAnswersResponseDto;
import com.example.generation_service.generators.models.GenerateTestRequestParams;
import com.example.generation_service.models.generation.TestQuestionsType;
import com.example.generation_service.services.ai.AIService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.theokanning.openai.completion.chat.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Slf4j
@RequiredArgsConstructor
public class AnswerGenerator {

    private static final String ANSWERS_CONTEXT_PROMPT_FILE = "/ai/answers_context_prompt.txt";
    private static final String ANSWERS_CONTEXT_MULTI_CHOISE_PROMPT_FILE = "/ai/multiple_choise/answers_context_prompt.txt";
    private static final String ANSWERS_SCHEMA_FILE = "/ai/schemas/answers.json";
    private static final String ANSWERS_MULTI_CHOICE_SCHEMA_FILE = "/ai/schemas/multiple_choise/answers.json";
    private static final List<TestQuestionsType> MULTI_CHOICE_TYPES = List.of(TestQuestionsType.MULTIPLE_CHOICE_MULTIPLE_ANSWERS, TestQuestionsType.MULTIPLE_CHOICE_SINGLE_ANSWER);

    @Value("${generation.models.answers}")
    private String model;

    private final GenerationConverter converter;
    private final AIService aiService;
    private final ObjectMapper objectMapper;


    public GenerateAnswersResponseDto generateData(final GenerateTestRequestParams request, final GenerateQuestionsResponseDto questionsResponseDto, final long timeout) throws Exception {
        log.info("Sending prompt to generation test. User id: {}, timeout: {}", request.getUserId(), timeout);

        final List<ChatMessage> messages = prepareMessages(request, questionsResponseDto);
        final JsonNode responseSchema = loadSchema(request.getQuestionsType());

        final String result = aiService.send(model, messages, responseSchema, request.getTemperature(), request.getTopP(), timeout);

        return converter.convertToAnswersResponseDto(result);
    }

    private List<ChatMessage> prepareMessages(final GenerateTestRequestParams request, final GenerateQuestionsResponseDto questionsResponseDto) throws JsonProcessingException, IOException {
        final String testGenerationRequest = converter.convert(questionsResponseDto);
        final String contextPrompt = loadContext(request.getQuestionsType());

        final ChatMessage context = new ChatMessage(ChatMessageRole.SYSTEM.value(), contextPrompt);
        final ChatMessage userText = new ChatMessage(ChatMessageRole.USER.value(), testGenerationRequest);

        return List.of(context, userText);
    }

    private String readFileContents(String fileName) throws IOException {
        try (InputStream in = getClass().getClassLoader().getResourceAsStream(fileName);
             BufferedReader reader = new BufferedReader(new InputStreamReader(in))) {
            if (in == null) {
                throw new IOException("Resource file not found: " + fileName);
            }
            return reader.lines().collect(Collectors.joining("\n"));
        }
    }

    private String loadContext(TestQuestionsType questionsType) {
        String schemaFile = MULTI_CHOICE_TYPES.stream().anyMatch(type -> type.equals(questionsType))
                ? ANSWERS_CONTEXT_MULTI_CHOISE_PROMPT_FILE
                : ANSWERS_CONTEXT_PROMPT_FILE;

        return loadResourceFile(schemaFile);
    }

    private JsonNode loadSchema(TestQuestionsType questionsType) throws JsonProcessingException {
        String schemaFile = TestQuestionsType.TRUE_FALSE.equals(questionsType)
                ? ANSWERS_SCHEMA_FILE
                : ANSWERS_MULTI_CHOICE_SCHEMA_FILE;

        return objectMapper.readTree(loadResourceFile(schemaFile));
    }
    private String loadResourceFile(String resourcePath) {
        try (InputStream in = getClass().getResourceAsStream(resourcePath);
             BufferedReader reader = new BufferedReader(new InputStreamReader(in))) {
            return reader.lines().collect(Collectors.joining("\n"));
        } catch (IOException e) {
            throw new RuntimeException("Error reading resource file: " + resourcePath, e);
        }
    }
}
