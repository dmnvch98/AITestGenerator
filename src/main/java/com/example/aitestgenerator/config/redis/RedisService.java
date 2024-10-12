package com.example.aitestgenerator.config.redis;

import com.example.aitestgenerator.utils.Utils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisService<T> {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    public void saveUserActivity(final Long userId, final String cid, final T activity) {
        final String hashKey = Utils.getHashKey(userId);
        try {
            final String json = objectMapper.writeValueAsString(activity);
            redisTemplate.opsForHash().put(hashKey, cid, json);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public T getUserActivity(final String hashKey, final String cid, final Class<T> clazz) {
        final Object activityJson = redisTemplate.opsForHash().get(hashKey, cid);

        if (activityJson == null) {
            return null;
        }

        try {
            return objectMapper.readValue(activityJson.toString(), clazz);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize activity", e);
        }
    }

    public Set<T> getUserActivities(final String hashKey, final Class<T> clazz) {
        final Map<Object, Object> entries = redisTemplate.opsForHash().entries(hashKey);

        return Optional.of(entries)
            .orElse(Collections.emptyMap())
            .values()
            .stream()
            .map(Object::toString)
            .map(s -> {
                try {
                    return objectMapper.readValue(s, clazz);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            })
            .collect(Collectors.toSet());
    }

    public void deleteUserActivity(final Long userId, final String cid) {
        final String hashKey = Utils.getHashKey(userId);
        redisTemplate.opsForHash().delete(hashKey, cid);
    }

    public void deleteAllKeys() {
        log.info("Delete all objects from the temp db");
        redisTemplate.getConnectionFactory().getConnection().flushDb();
    }

    public List<T> getAllObjectsFromHashes(final Class<T> clazz) {
        final List<T> resultList = new ArrayList<>();

        final ScanOptions options = ScanOptions.scanOptions().count(100).build();
        try (Cursor<byte[]> cursor = redisTemplate.getConnectionFactory().getConnection().scan(options)) {
            while (cursor.hasNext()) {
                byte[] keyBytes = cursor.next();
                final String key = new String(keyBytes);

                if (redisTemplate.opsForHash().size(key) > 0) {
                    final Map<Object, Object> entries = redisTemplate.opsForHash().entries(key);

                    for (Object value : entries.values()) {
                        try {
                            resultList.add(objectMapper.readValue(value.toString(), clazz));
                        } catch (JsonProcessingException e) {
                            throw new RuntimeException("Failed to deserialize value for key " + key, e);
                        }
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve objects from hashes", e);
        }

        return resultList;
    }

}
