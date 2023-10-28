package com.example.aitestgenerator.models;

import com.fasterxml.jackson.annotation.JsonFormat;

public enum GenerationStatus {
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    WAITING("Waiting"),
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    IN_PROCESS("In process"),
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    FAILED("Failed"),
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    SUCCESS("Success");

    private final String text;

    GenerationStatus(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }
}

