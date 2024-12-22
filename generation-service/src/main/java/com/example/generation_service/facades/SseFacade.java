package com.example.generation_service.facades;

import com.example.generation_service.services.redis.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class SseFacade {

    private static final int TTL = 60;
    private static final String UUID_TO_USER_ID_KEY = "sub-uuid_to_userId:";
    private static final String USER_ID_TO_UUID_KEY = "sub-userId_to_uuid:";
    private final RedisService redisService;

    public String generateAndSaveUserSubscriptionId(final Long userId) {
        final String userIdToUUIDkey = buildKey(userId, USER_ID_TO_UUID_KEY);

        Optional<String> existingSubscriptionId = redisService.getObjectAsString(userIdToUUIDkey, String.class);

        if (existingSubscriptionId.isPresent()) {
            return existingSubscriptionId.get();
        }

        final UUID subscriptionId = UUID.randomUUID();
        final String uuidToUserIdkey = buildKey(subscriptionId, UUID_TO_USER_ID_KEY);

        // Save two entries in Redis to establish a bidirectional mapping:
        // 1. Key userId -> UUID (to quickly retrieve the subscriptionId for a userId).
        // 2. Key UUID -> userId (to verify the existence of or retrieve userId for a subscriptionId).
        redisService.saveObjectAsString(userIdToUUIDkey, subscriptionId.toString(), TTL);
        redisService.saveObjectAsString(uuidToUserIdkey, userId.toString(), TTL);

        return subscriptionId.toString();
    }

    public Long getUserIdBySubId(final String subscriptionId) {
        final String key = buildKey(subscriptionId, UUID_TO_USER_ID_KEY);
        final Optional<String> userId = redisService.getObjectAsString(key, String.class);
        if (userId.isPresent()) {
            return Long.parseLong(userId.get());
        }
        throw new IllegalArgumentException("User subscription id not found");
    }

    private String buildKey(final Object id, final String keyPrefix) {
        return keyPrefix + id;
    }
}
