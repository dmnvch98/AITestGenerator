package com.example.generation_service.controllers.alerts;

import com.example.generation_service.dto.alerts.AlertExistsResponseDto;
import com.example.generation_service.dto.alerts.OpenAiStatusAlertDto;
import com.example.generation_service.facades.alert.AlertFacade;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/v1/incidents")
@RestController
@RequiredArgsConstructor
@Slf4j
public class AlertController {

    private final AlertFacade alertFacade;

    @PostMapping("/webhook/resolve")
    public void resolveIncident(final @RequestBody OpenAiStatusAlertDto alertDto) {
        alertFacade.resolveIncident(alertDto);
    }

    @GetMapping
    public AlertExistsResponseDto isIncidentExists() {
        return alertFacade.isIncidentExists();
    }
}
