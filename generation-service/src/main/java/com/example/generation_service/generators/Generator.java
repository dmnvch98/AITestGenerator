package com.example.generation_service.generators;

import com.example.generation_service.generators.models.GenerateTestRequestParams;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;


import java.util.List;
import java.util.stream.Collectors;

import static com.example.generation_service.utils.Utils.countTokens;

public abstract class Generator<T> {

    public abstract T generateData(final GenerateTestRequestParams request, final long timeout) throws Exception;

    @Autowired
    protected OpenAiService openAiService;

    protected ChatMessage createChatMessage(String content) {
        ChatMessage message = new ChatMessage();
        message.setContent(content);
        message.setRole("user");
        return message;
    }

    protected ChatCompletionRequest buildChatCompletionRequest(List<ChatMessage> chatMessages) {
        int tokensCount = countTokens(chatMessages
                .stream()
                .map(ChatMessage::getContent)
                .collect(Collectors.joining()));

        return ChatCompletionRequest.builder()
                .model("gpt-4o")
                .messages(chatMessages)
                .temperature(0.2)
                .build();
    }

    protected void extractAnswer(final ChatCompletionResult chatCompletionResult, List<ChatMessage> messages) {
        messages.add(chatCompletionResult.getChoices().get(0).getMessage());
    }
}
