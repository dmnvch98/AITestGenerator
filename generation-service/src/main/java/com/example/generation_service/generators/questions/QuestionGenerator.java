package com.example.generation_service.generators.questions;

import com.example.generation_service.converters.GenerationConverter;
import com.example.generation_service.dto.generation.GenerateTestCorrectAnswersResponseDto;
import com.example.generation_service.generators.models.GenerateTestRequestParams;
import com.example.generation_service.models.generation.QuestionType;
import com.example.generation_service.services.ai.AIService;
import com.example.generation_service.utils.Utils;
import com.fasterxml.jackson.databind.JsonNode;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import lombok.RequiredArgsConstructor;
import lombok.experimental.SuperBuilder;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.StringSubstitutor;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.Map;

@SuperBuilder
@Slf4j
@RequiredArgsConstructor
public abstract class QuestionGenerator {

    protected final static String CONTEXT = "/ai/question_context_prompt.txt";

    @Value("${generation.models.question}")
    private String model;

    private final GenerationConverter converter;
    private final AIService aiService;

    public abstract GenerateTestCorrectAnswersResponseDto generateData(
            final GenerateTestRequestParams request,
            final long timeout
    ) throws Exception;

    protected GenerateTestCorrectAnswersResponseDto generateData(
            final GenerateTestRequestParams request,
            final long timeout,
            final String schemaPath
    ) throws Exception {
        log.info("Sending prompt to generate questions. User id: {}, timeout: {}", request.getUserId(), timeout);

        final JsonNode responseSchema = Utils.loadSchema(schemaPath);
        final List<ChatMessage> chatMessages = prepareMessages(request);
        final String result = aiService.send(
                model,
                chatMessages,
                responseSchema,
                timeout
        );

        return converter.convertTestIncorrectAnswers(result);
    }

    protected List<ChatMessage> prepareMessages(final GenerateTestRequestParams request) {
        final String contextTemplate = Utils.loadResourceFile(QuestionGenerator.CONTEXT);
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

    public abstract QuestionType getTestQuestionsType();
}
