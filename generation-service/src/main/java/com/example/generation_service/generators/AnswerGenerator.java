package com.example.generation_service.generators;

import com.example.generation_service.converters.GenerationConverter;
import com.example.generation_service.dto.generation.GenerateQuestionsResponseDto;
import com.example.generation_service.dto.generation.GenerateAnswersResponseDto;
import com.example.generation_service.generators.models.GenerateTestRequest;
import com.example.generation_service.models.GenerationInfo;
import com.example.generation_service.repositories.GenerationInfoRepository;
import com.example.generation_service.services.ai.AIService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.theokanning.openai.completion.chat.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.StringSubstitutor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.example.generation_service.utils.Utils.countTokens;

@Component
@Slf4j
@RequiredArgsConstructor
public class AnswerGenerator {

    private static final String ANSWERS_CONTEXT_PROMPT_FILE = "ai/answers_context_prompt.txt";
    private static final String ANSWERS_SCHEMA_FILE = "ai/schemas/answers.json";

    @Value("${generation.models.answers}")
    private String model;

    private final GenerationConverter converter;
    private final AIService aiService;
    private final GenerationInfoRepository generationInfoRepository;
    private final ObjectMapper objectMapper;


    public GenerateAnswersResponseDto generateData(final GenerateTestRequest request, final GenerateQuestionsResponseDto questionsResponseDto, final long timeout) throws Exception {
        log.info("Sending prompt to generation test. User id: {}, timeout: {}", request.getUserId(), timeout);

        final LocalDateTime startTime = LocalDateTime.now();

        final List<ChatMessage> messages = prepareMessages(request, questionsResponseDto);
        final JsonNode responseSchema = objectMapper.readTree(readFileContents(ANSWERS_SCHEMA_FILE));

        final String result = aiService.send(model, messages, responseSchema, request.getTemperature(), request.getTopP(), timeout);
//        handleTokensCount(request.getUserId(), request.getText(), getContextPrompt(), result, startTime);

        return converter.convertToAnswersResponseDto(result);
    }

    private List<ChatMessage> prepareMessages(final GenerateTestRequest request, final GenerateQuestionsResponseDto questionsResponseDto) throws JsonProcessingException, IOException {
        final String testGenerationRequest = converter.convert(questionsResponseDto, request);

        final String contextTemplate = readFileContents(ANSWERS_CONTEXT_PROMPT_FILE);

        final Map<String, Object> variables = new HashMap<>();
        variables.put("answersCount", request.getAnswersCount());
        variables.put("correctAnswersCount", request.getCorrectAnswersCount());

        final StringSubstitutor substitutor = new StringSubstitutor(variables);
        final String contextPrompt = substitutor.replace(contextTemplate);

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

    private void handleTokensCount(final long userId, final String text, final String contextPrompt,
                                   final String response, final LocalDateTime startTime) {
        final GenerationInfo generationInfo = GenerationInfo
                .builder()
                .userId(userId)
                .userInputTokens(countTokens(text))
                .systemInputTokens(countTokens(contextPrompt))
                .outputTokens(countTokens(response))
                .generationStart(startTime)
                .generationEnd(LocalDateTime.now())
                .build();
        generationInfoRepository.save(generationInfo);
    }
}
