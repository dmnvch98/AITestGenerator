package com.example.generation_service.facades.alert;

import com.example.generation_service.converters.alerts.AlertConverter;
import com.example.generation_service.dto.alerts.AlertExistsResponseDto;
import com.example.generation_service.dto.alerts.OpenAiStatusAlertDto;
import com.example.generation_service.models.webhook.IncidentStatus;
import com.example.generation_service.services.alert.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AlertFacade {

    private final AlertService alertService;
    private final AlertConverter alertConverter;

    public void resolveIncident(final OpenAiStatusAlertDto alertDto) {
        final IncidentStatus incidentStatus = alertDto.getStatus();

        if (IncidentStatus.COMPLETED.equals(incidentStatus) || IncidentStatus.RESOLVED.equals(incidentStatus)) {
            alertService.deleteByIncidentId(alertDto.getId());
        } else {
            alertService.save(alertConverter.convert(alertDto));
        }
    }

    public AlertExistsResponseDto isIncidentExists() {
        return AlertExistsResponseDto.builder().exists(alertService.isIncidentExists()).build();
    }
}
