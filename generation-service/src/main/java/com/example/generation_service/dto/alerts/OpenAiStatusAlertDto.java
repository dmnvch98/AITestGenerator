package com.example.generation_service.dto.alerts;

import com.example.generation_service.models.webhook.IncidentStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

@Jacksonized
@JsonIgnoreProperties(ignoreUnknown = true)
@Builder
@Getter
public class OpenAiStatusAlertDto {

    private String id;
    private IncidentStatus status;
}
