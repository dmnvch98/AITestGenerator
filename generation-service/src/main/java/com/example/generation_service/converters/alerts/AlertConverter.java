package com.example.generation_service.converters.alerts;

import com.example.generation_service.dto.alerts.OpenAiStatusAlertDto;
import com.example.generation_service.models.webhook.OpenAiStatusAlert;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface AlertConverter {

    @Mapping(source = "id", target = "incidentId")
    @Mapping(target = "id", ignore = true)
    OpenAiStatusAlert convert(final OpenAiStatusAlertDto alert);
}
