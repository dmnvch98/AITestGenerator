package com.example.generation_service.models.enums;

import lombok.Getter;

@Getter
public enum ActivityStatus {

    WAITING(1),

    IN_PROCESS(2),

    FAILED(3),

    SUCCESS(4);

    private final int priority;

    ActivityStatus(int priority) {
        this.priority = priority;
    }
}

