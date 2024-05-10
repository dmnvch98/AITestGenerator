package com.example.aitestgenerator.models;

import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

@Builder
@Jacksonized
@Getter
public class GenerateTestMessage {

    private final long textId;
    private final long userId;
}
