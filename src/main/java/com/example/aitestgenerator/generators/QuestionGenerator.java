package com.example.aitestgenerator.generators;

import com.example.aitestgenerator.holder.TestGeneratingHistoryHolder;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.enums.GenerationStatus;
import com.example.aitestgenerator.services.TestGeneratingHistoryService;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

import static com.example.aitestgenerator.utils.Utils.*;

@Component
@Slf4j
@RequiredArgsConstructor
public class QuestionGenerator extends Generator<List<ChatMessage>> {

    private static final String QUESTIONS_PROMPT_FILE = "ai_prompts/generate_questions.txt";

    private final OpenAiService openAiService;
    private final TestGeneratingHistoryService historyService;
    private final TestGeneratingHistoryHolder historyHolder;

    @Override
    public List<ChatMessage> generateData(TestGeneratingHistory history, List<ChatMessage> messages) throws IOException {
        log.info("Sending prompt to AI. Text id: {}, User id: {}", history.getText().getId(), history.getUser().getId());
        prepareMessages(history, messages);

        final ChatCompletionResult result = openAiService.createChatCompletion(buildChatCompletionRequest(messages));
        return processResult(result, messages);
    }

    private void prepareMessages(TestGeneratingHistory history, List<ChatMessage> messages) {
        String textWithoutHTML = removeHTMLTags(history.getText().getContent());
        ChatMessage textPromptMessage = createChatMessage(textWithoutHTML);
        ChatMessage questionsPromptMessage = createChatMessage(readFileContents(QUESTIONS_PROMPT_FILE));

        messages.add(textPromptMessage);
        messages.add(questionsPromptMessage);
    }

    private List<ChatMessage> processResult(ChatCompletionResult result, List<ChatMessage> messages) throws IOException {
        String resultContent = result.getChoices().get(0).getMessage().getContent();
        if (resultContent.isEmpty()) {
            log.error("No content received from AI service.");
            throw new IOException("No content received from AI service.");
        }
        extractAnswer(result, messages);
        return messages;
    }
}
