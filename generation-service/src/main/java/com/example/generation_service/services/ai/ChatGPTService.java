package com.example.generation_service.services.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.theokanning.openai.Usage;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
@Slf4j
public class ChatGPTService implements AIService {

    private final OpenAiService openAiService;

    @Override
    public String send(final String model, final List<ChatMessage> messages, final JsonNode schema, long timeout) throws Exception {

        final ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model(model)
                .messages(messages)
                .responseFormat(ChatCompletionRequest.JsonSchemaResponseFormat.builder().jsonSchema(schema).build())
                .temperature(0.3)
                .topP(0.9)
                .stream(false)
                .build();
        final ChatCompletionResult chatCompletionResult = openAiService.createCompletionWithTimeout(request, timeout);
        final Usage usage = chatCompletionResult.getUsage();
        log.info("AI request is done, completion tokens count=[{}], prompt tokens count=[{}], total tokens=[{}]", usage.getCompletionTokens(), usage.getPromptTokens(), usage.getTotalTokens());
        return chatCompletionResult.getChoices().get(0).getMessage().getContent();
    }
}
