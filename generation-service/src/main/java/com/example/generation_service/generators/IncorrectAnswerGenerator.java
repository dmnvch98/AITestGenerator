package com.example.generation_service.generators;

import com.example.generation_service.converters.GenerationConverter;
import com.example.generation_service.dto.generation.GenerateTestCorrectAnswersResponseDto;
import com.example.generation_service.dto.generation.GenerateTestIncorrectAnswersResponseDto;
import com.example.generation_service.generators.models.GenerateTestRequestParams;
import com.example.generation_service.services.ai.AIService;
import com.example.generation_service.utils.Utils;
import com.fasterxml.jackson.databind.JsonNode;
import com.theokanning.openai.completion.chat.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class IncorrectAnswerGenerator {

    protected final static String CONTEXT = "/ai/multiple_choise/answers_context_prompt.txt";
    protected final static String SCHEMA = "/ai/schemas/multiple_choise/incorrect-answers.json";

    @Value("${generation.models.answers}")
    private String model;

    private final GenerationConverter converter;
    private final AIService aiService;

    public GenerateTestIncorrectAnswersResponseDto generateData(
            final GenerateTestRequestParams request,
            final GenerateTestCorrectAnswersResponseDto questionsResponseDto,
            final long timeout
            ) throws Exception {
        log.info("Sending prompt to generation test. User id: {}, timeout: {}", request.getUserId(), timeout);

        final List<ChatMessage> messages = prepareMessages(questionsResponseDto);
        final JsonNode responseSchema = Utils.loadSchema(SCHEMA);

        final String result = aiService.send(model, messages, responseSchema, timeout);

        return converter.convertTestIncorrectAnswersDto(result);
    }

    private List<ChatMessage> prepareMessages(final GenerateTestCorrectAnswersResponseDto questionsResponseDto) throws IOException {
        final String testGenerationRequest = converter.convertTestIncorrectAnswers(questionsResponseDto);
        final String contextPrompt = Utils.loadResourceFile(IncorrectAnswerGenerator.CONTEXT);

        final ChatMessage context = new ChatMessage(ChatMessageRole.SYSTEM.value(), contextPrompt);
        final ChatMessage userText = new ChatMessage(ChatMessageRole.USER.value(), testGenerationRequest);

        return List.of(context, userText);
    }
}
