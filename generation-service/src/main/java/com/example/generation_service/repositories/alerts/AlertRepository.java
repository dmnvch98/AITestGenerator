package com.example.generation_service.repositories.alerts;

import com.example.generation_service.models.webhook.OpenAiStatusAlert;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

public interface AlertRepository extends CrudRepository<OpenAiStatusAlert, Long> {

    @Transactional
    @Modifying
    void deleteByIncidentId(final String incidentId);

}
