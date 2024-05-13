package com.example.aitestgenerator.generators;

import com.example.aitestgenerator.holder.TestGeneratingHistoryHolder;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.enums.GenerationStatus;
import com.example.aitestgenerator.services.TestGeneratingHistoryService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;


import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

import static com.example.aitestgenerator.utils.Utils.readFileContents;

@Component
@Slf4j
@RequiredArgsConstructor
public class AnswerGenerator extends Generator<Test> {

    private final OpenAiService openAiService;
    private final TestGeneratingHistoryService historyService;
    private final TestGeneratingHistoryHolder historyHolder;
    private final ObjectMapper objectMapper;

    @Override
    public Test generateData(TestGeneratingHistory history, List<ChatMessage> messages) throws JsonProcessingException {
        log.info("Generating Test. Text id: {}, User id: {}", history.getText().getId(), history.getUser().getId());
        final String testPrompt = readFileContents("ai_prompts/generate_test.txt");
        final ChatMessage testPromptMessage = createChatMessage(testPrompt);
        messages.add(testPromptMessage);

        log.info("Sending prompt to AI. Text id: {}, User id: {}", history.getText().getId(), history.getUser().getId());

        final ChatCompletionResult result = openAiService.createChatCompletion(buildChatCompletionRequest(messages));
        Test testResult;
        try {
            testResult = parseTest(result, history);
        } catch (JsonProcessingException e) {
            log.error("An error occurred when parsing test. UserId: {}, textId: {}, Error: {}",
                    history.getUser().getId(), history.getText().getId(), e.getMessage());
            throw e;
        }
        log.info("Test generation completed. Text id: {}, User id: {}", history.getText().getId(), history.getUser().getId());

        history.setGenerationEnd(LocalDateTime.now());
        history.setGenerationStatus(GenerationStatus.SUCCESS);

        historyService.save(history);
        historyHolder.clearHistory();

        return testResult;
    }

    private Test parseTest(final ChatCompletionResult result, TestGeneratingHistory history) throws JsonProcessingException {
        final String json = result.getChoices().get(0).getMessage().getContent();
        final Test test = objectMapper.readValue(json, Test.class);
        final String testTitle = test.getTitle();
        test.setTitle(testTitle != null ? testTitle : history.getText().getTitle());
        return test;
    }
}
