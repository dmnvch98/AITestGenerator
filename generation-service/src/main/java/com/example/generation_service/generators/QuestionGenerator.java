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
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

import static com.example.generation_service.utils.Utils.*;

@Component
@Slf4j
@RequiredArgsConstructor
public class QuestionGenerator extends Generator<GenerateQuestionsResponseDto> {

    private static final String QUESTIONS_CONTEXT_PROMPT_FILE = "ai/question_context_prompt.txt";
    private static final String QUESTIONS_SCHEMA_FILE = "ai/schemas/questions.json";

    @Value("${generation.models.question}")
    private String model;

    private final GenerationConverter converter;
    private final AIService aiService;
    private final ObjectMapper objectMapper;

    @Override
    public GenerateQuestionsResponseDto generateData(final GenerateTestRequest request) throws IOException {
        log.info("Sending prompt to generation questions. User id: {}", request.getUserId());

        final JsonNode responseSchema = objectMapper.readTree(readFileContents(QUESTIONS_SCHEMA_FILE));
        final List<ChatMessage> chatMessages = prepareMessages(request);
        final String result = aiService.send(model, chatMessages, responseSchema, request.getTemperature(), request.getTopP());
        log.info("Question generation is done. User id: {}", request.getUserId());
        return converter.convert(result);
    }

    private List<ChatMessage> prepareMessages(final GenerateTestRequest request) throws JsonProcessingException {
        final String contextPrompt = readFileContents(QUESTIONS_CONTEXT_PROMPT_FILE);
        final String userPrompt = converter.convert(request);

        final ChatMessage context = new ChatMessage(ChatMessageRole.SYSTEM.value(), contextPrompt);
        final ChatMessage userText = new ChatMessage(ChatMessageRole.USER.value(), userPrompt);

        return List.of(context, userText);
    }

}
