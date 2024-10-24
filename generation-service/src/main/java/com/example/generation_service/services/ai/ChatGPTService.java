package com.example.generation_service.services.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class ChatGPTService implements AIService {

    private final OpenAiService openAiService;

    @Override
    public String send(final String model, final List<ChatMessage> messages, final JsonNode schema, final double temperature, final double topP) {

        final ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model(model)
                .messages(messages)
                .temperature(temperature)
                .topP(topP)
                .responseFormat(ChatCompletionRequest.JsonSchemaResponseFormat.builder().jsonSchema(schema).build())
                .stream(false)
                .build();

        return openAiService.createChatCompletion(request).getChoices().get(0).getMessage().getContent();
    }
}
