package com.example.generation_service.services.notification;

import com.example.generation_service.dto.sse.NotificationType;
import com.example.generation_service.dto.sse.SseSendNotificationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter createEmitter(Long userId) {

        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.put(userId, emitter);

        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));
        emitter.onError((ex) -> emitters.remove(userId));

        return emitter;
    }

    public void sendNotificationToUser(final Long userId, final NotificationType notificationType) {
        final SseSendNotificationDto dto = SseSendNotificationDto.builder().type(notificationType).build();
        final SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name("message").data(dto));
            } catch (IOException e) {
                emitters.remove(userId);
            }
        }
    }
}
