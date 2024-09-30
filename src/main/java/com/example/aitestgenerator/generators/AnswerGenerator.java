package com.example.aitestgenerator.generators;

import com.example.aitestgenerator.converters.GenerationConverter;
import com.example.aitestgenerator.dto.generation.GenerateQuestionsResponseDto;
import com.example.aitestgenerator.dto.generation.GenerateAnswersResponseDto;
import com.example.aitestgenerator.generators.models.GenerateTestRequest;
import com.example.aitestgenerator.models.GenerationInfo;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.enums.GenerationStatus;
import com.example.aitestgenerator.repositories.GenerationInfoRepository;
import com.example.aitestgenerator.services.TestGeneratingHistoryService;
import com.example.aitestgenerator.services.ai.AIService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.theokanning.openai.completion.chat.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


import java.time.LocalDateTime;
import java.util.List;

import static com.example.aitestgenerator.utils.Utils.countTokens;
import static com.example.aitestgenerator.utils.Utils.readFileContents;

@Component
@Slf4j
@RequiredArgsConstructor
public class AnswerGenerator {

    private static final String ANSWERS_CONTEXT_PROMPT_FILE = "ai/answers_context_prompt.txt";
    private static final String ANSWERS_SCHEMA_FILE = "ai/schemas/answers.json";

    @Value("${generation.models.answers}")
    private String model;

    private final TestGeneratingHistoryService historyService;
    private final GenerationConverter converter;
    private final AIService aiService;
    private final GenerationInfoRepository generationInfoRepository;
    private final ObjectMapper objectMapper;


    public GenerateAnswersResponseDto generateData(final GenerateTestRequest request, final GenerateQuestionsResponseDto questionsResponseDto) throws JsonProcessingException {
        log.info("Sending prompt to generation test. User id: {}", request.getUserId());

        final LocalDateTime startTime = LocalDateTime.now();

        final List<ChatMessage> messages = prepareMessages(request, questionsResponseDto);
        final JsonNode responseSchema = objectMapper.readTree(readFileContents(ANSWERS_SCHEMA_FILE));

        final String result = aiService.send(model, messages, responseSchema, request.getTemperature(), request.getTopP());
//        handleTokensCount(request.getUserId(), request.getText(), getContextPrompt(), result, startTime);

        final GenerateAnswersResponseDto answersResponseDto = converter.convertToAnswersResponseDto(result);
        handleHistory(request.getHistory());
        return answersResponseDto;
    }

    private List<ChatMessage> prepareMessages(final GenerateTestRequest request, final GenerateQuestionsResponseDto questionsResponseDto) throws JsonProcessingException {
        final String contextPrompt = readFileContents(ANSWERS_CONTEXT_PROMPT_FILE);
        final String testGenerationRequest = converter.convert(questionsResponseDto, request);

        final ChatMessage context = new ChatMessage(ChatMessageRole.SYSTEM.value(), contextPrompt);
        final ChatMessage userText = new ChatMessage(ChatMessageRole.USER.value(), testGenerationRequest);

        return List.of(context, userText);
    }


    private void handleHistory(final TestGeneratingHistory history) {
        history.setGenerationEnd(LocalDateTime.now());
        history.setGenerationStatus(GenerationStatus.SUCCESS);

        historyService.save(history);
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
