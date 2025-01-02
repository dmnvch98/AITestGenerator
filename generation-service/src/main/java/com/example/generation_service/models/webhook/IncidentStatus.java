package com.example.generation_service.models.webhook;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum IncidentStatus {

    @JsonProperty("investigating")
    INVESTIGATING,

    @JsonProperty("identified")
    IDENTIFIED,

    @JsonProperty("monitoring")
    MONITORING,

    @JsonProperty("resolved")
    RESOLVED,

    @JsonProperty("scheduled")
    SCHEDULED,

    @JsonProperty("in_progress")
    IN_PROGRESS,

    @JsonProperty("verifying")
    VERIFYING,

    @JsonProperty("completed")
    COMPLETED
}
