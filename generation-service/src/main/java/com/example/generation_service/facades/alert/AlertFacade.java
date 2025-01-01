package com.example.generation_service.facades.alert;

import com.example.generation_service.converters.alerts.AlertConverter;
import com.example.generation_service.dto.alerts.AlertExistsResponseDto;
import com.example.generation_service.dto.alerts.OpenAiStatusAlertDto;
import com.example.generation_service.models.webhook.IncidentStatus;
import com.example.generation_service.services.alert.AlertService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AlertFacade {

    private final AlertService alertService;
    private final AlertConverter alertConverter;

    public void resolveIncident(final OpenAiStatusAlertDto alertDto) {
        log.info("Resolving incident for alert: {}", alertDto);
        final IncidentStatus incidentStatus = alertDto.getStatus();

        if (IncidentStatus.COMPLETED.equals(incidentStatus) || IncidentStatus.RESOLVED.equals(incidentStatus)) {
            log.info("Incident is already resolved for alert: {}", alertDto);
            alertService.deleteByIncidentId(alertDto.getId());
        } else {
            log.info("Saving incident for alert: {}", alertDto);
            alertService.save(alertConverter.convert(alertDto));
        }
    }

    public AlertExistsResponseDto isIncidentExists() {
        return AlertExistsResponseDto.builder().exists(alertService.isIncidentExists()).build();
    }

    public void delete(final String incidentId) {
        log.info("Deleting incident for alert: {}", incidentId);
        alertService.deleteByIncidentId(incidentId);
    }
}
