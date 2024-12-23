package com.example.generation_service.services.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.theokanning.openai.completion.chat.ChatMessage;

import java.util.List;

public interface AIService {
    String send(final String fineTunedModelId, final List<ChatMessage> messages, final JsonNode schema, final double temperature, final double topP, long timeout) throws Exception;
}
