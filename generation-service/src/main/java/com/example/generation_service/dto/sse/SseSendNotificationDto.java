package com.example.generation_service.dto.sse;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class SseSendNotificationDto {

    final NotificationType type;
}
