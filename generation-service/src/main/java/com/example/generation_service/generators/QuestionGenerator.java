package com.example.generation_service.generators;

import com.example.generation_service.converters.GenerationConverter;
import com.example.generation_service.dto.generation.GenerateQuestionsResponseDto;
import com.example.generation_service.generators.models.GenerateTestRequestParams;
import com.example.generation_service.models.generation.TestQuestionsType;
import com.example.generation_service.services.ai.AIService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.StringSubstitutor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@Slf4j
@RequiredArgsConstructor
public class QuestionGenerator {

    private static final String QUESTIONS_CONTEXT_PROMPT_FILE = "/ai/question_context_prompt.txt";
    private static final String QUESTIONS_SCHEMA_FILE = "/ai/schemas/questions.json";
    private static final String QUESTIONS_TRUE_FALSE_SCHEMA_FILE = "/ai/schemas/true_false/questions.json";

    @Value("${generation.models.question}")
    private String model;

    private final GenerationConverter converter;
    private final AIService aiService;
    private final ObjectMapper objectMapper;

    public GenerateQuestionsResponseDto generateData(final GenerateTestRequestParams request, final long timeout) throws Exception {
        log.info("Sending prompt to generate questions. User id: {}, timeout: {}", request.getUserId(), timeout);

        final JsonNode responseSchema = loadSchema(request.getQuestionsType());
        final List<ChatMessage> chatMessages = prepareMessages(request);
        final String result = aiService.send(model, chatMessages, responseSchema, request.getTemperature(), request.getTopP(), timeout);

        return converter.convert(result);
    }

    private List<ChatMessage> prepareMessages(final GenerateTestRequestParams request) {
        final String contextTemplate = loadResourceFile(QUESTIONS_CONTEXT_PROMPT_FILE);
        final Map<String, Object> variables = Map.of(
                "questionType", request.getQuestionsType().getName(),
                "typeDescription", request.getQuestionsType().getDescription()
        );

        final StringSubstitutor substitutor = new StringSubstitutor(variables);
        final String contextPrompt = substitutor.replace(contextTemplate);

        final ChatMessage context = new ChatMessage(ChatMessageRole.SYSTEM.value(), contextPrompt);
        final ChatMessage userText = new ChatMessage(ChatMessageRole.USER.value(), request.getText());

        return List.of(context, userText);
    }

    private JsonNode loadSchema(TestQuestionsType questionsType) throws JsonProcessingException {
        String schemaFile = TestQuestionsType.TRUE_FALSE.equals(questionsType)
                ? QUESTIONS_TRUE_FALSE_SCHEMA_FILE
                : QUESTIONS_SCHEMA_FILE;

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