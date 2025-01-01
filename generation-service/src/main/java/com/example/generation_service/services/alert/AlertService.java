package com.example.generation_service.services.alert;

import com.example.generation_service.models.webhook.OpenAiStatusAlert;
import com.example.generation_service.repositories.alerts.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;

    public void save(final OpenAiStatusAlert openAiStatusAlert) {
        alertRepository.save(openAiStatusAlert);
    }

    public void deleteByIncidentId(final String incidentId) {
        alertRepository.deleteByIncidentId(incidentId);
    }

    public boolean isIncidentExists() {
        return alertRepository.count() > 0;
    }

    public void delete(final String incidentId) {
        alertRepository.deleteByIncidentId(incidentId);
    }
}
