package com.example.aitestgenerator.generators;

import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import static com.example.aitestgenerator.utils.Utils.countTokens;

public abstract class Generator<T> {

    public abstract T generateData(TestGeneratingHistory history, List<ChatMessage> messages) throws IOException;

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

        int maxTokens = 16000 - tokensCount;

        return ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo-16k-0613")
                .messages(chatMessages)
                .maxTokens(maxTokens)
                .temperature(1.0)
                .topP(1.0)
                .build();
    }

    protected void extractAnswer(final ChatCompletionResult chatCompletionResult, List<ChatMessage> messages) {
        messages.add(chatCompletionResult.getChoices().get(0).getMessage());
    }
}
