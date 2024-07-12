package com.example.aitestgenerator.generators;

import com.example.aitestgenerator.generators.models.GenerateTestRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
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

    @Override
    public List<ChatMessage> generateData(final GenerateTestRequest request) throws IOException {
        log.info("Sending prompt to AI. User id: {}",
                request.getHistory().getUser().getId());
        prepareMessages(request);

        final ChatCompletionResult result = openAiService.createChatCompletion(buildChatCompletionRequest(request.getMessages()));
        return processResult(result, request.getMessages());
    }

    private void prepareMessages(final GenerateTestRequest request) {
        final String textWithoutHTML = removeHTMLTags(request.getContent());
        final ChatMessage textPromptMessage = createChatMessage(textWithoutHTML);
        final ChatMessage questionsPromptMessage = createChatMessage(readFileContents(QUESTIONS_PROMPT_FILE));

        request.getMessages().add(textPromptMessage);
        request.getMessages().add(questionsPromptMessage);
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
