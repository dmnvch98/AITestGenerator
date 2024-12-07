package com.example.generation_service.dto.users;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

@AllArgsConstructor
@Jacksonized
@JsonIgnoreProperties(ignoreUnknown = true)
@Builder
@Getter
public class UpdateUserFeatureRequestDto {
    private final String featureName;
    private final Boolean enabled;
}
