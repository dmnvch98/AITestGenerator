package com.example.aitestgenerator.generators.models;

import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.theokanning.openai.completion.chat.ChatMessage;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class GenerateTestRequest {

    private TestGeneratingHistory history;
    private List<ChatMessage> messages;
    private final String content;
}
