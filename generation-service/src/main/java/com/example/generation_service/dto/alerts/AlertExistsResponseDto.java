package com.example.generation_service.dto.alerts;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AlertExistsResponseDto {

    private boolean exists;
}
