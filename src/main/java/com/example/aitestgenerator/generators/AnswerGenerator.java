package com.example.aitestgenerator.generators;

import com.example.aitestgenerator.generators.models.GenerateTestRequest;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.enums.GenerationStatus;
import com.example.aitestgenerator.services.TestGeneratingHistoryService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;


import java.time.LocalDateTime;
import java.util.List;

import static com.example.aitestgenerator.utils.Utils.readFileContents;

@Component
@Slf4j
@RequiredArgsConstructor
public class AnswerGenerator extends Generator<Test> {

    private final TestGeneratingHistoryService historyService;
    private final ObjectMapper objectMapper;

    @Override
    public Test generateData(final GenerateTestRequest request) throws JsonProcessingException {
        TestGeneratingHistory history = request.getHistory();
        List<ChatMessage> messages = request.getMessages();
        log.info("Generating Test. User id: {}", history.getUser().getId());
        final String testPrompt = readFileContents("ai_prompts/generate_test.txt");
        final ChatMessage testPromptMessage = createChatMessage(testPrompt);
        messages.add(testPromptMessage);

        log.info("Sending prompt to AI. User id: {}", history.getUser().getId());

        final ChatCompletionResult result = openAiService.createChatCompletion(buildChatCompletionRequest(messages));
        final Test testResult =  processResult(history, result);
        handleHistory(history);
        return testResult;
    }

    private Test parseTest(final ChatCompletionResult result, TestGeneratingHistory history) throws JsonProcessingException {
        final String json = result.getChoices().get(0).getMessage().getContent();
        final Test test = objectMapper.readValue(json, Test.class);
        final String testTitle = test.getTitle();
        test.setTitle(testTitle != null ? testTitle : history.getText().getTitle());
        return test;
    }

    private void handleHistory(final TestGeneratingHistory history) {
        history.setGenerationEnd(LocalDateTime.now());
        history.setGenerationStatus(GenerationStatus.SUCCESS);

        historyService.save(history);
    }

    private Test processResult(final TestGeneratingHistory history, final ChatCompletionResult result)
        throws JsonProcessingException {
//        Test testResult;
//        try {
         final Test testResult = parseTest(result, history);
//        } catch (JsonProcessingException e) {
//            log.error("An error occurred when parsing test. UserId: {}, Error: {}",
//                history.getUser().getId(), e.getMessage());
//            throw e;
//        }
        log.info("Test generation completed. User id: {}", history.getUser().getId());

        return testResult;
    }
}
