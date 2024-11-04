package com.example.generation_service.services.redis;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class RedisService {

    @Getter
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    public <T> void saveObjectToHash(final String key, final String subKey, final T object) {
        try {
            String json = objectMapper.writeValueAsString(object);
            redisTemplate.opsForHash().put(key, subKey, json);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize object for key {}: {}", key, e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public <T> Optional<T> getObjectFromHash(final String key, final String subKey, final Class<T> clazz) {
        Object json = redisTemplate.opsForHash().get(key, subKey);
        if (json == null) {
            return Optional.empty();
        }
        try {
            return Optional.of(objectMapper.readValue(json.toString(), clazz));
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize object for key {}: {}", key, e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public <T> Set<T> getAllObjectsFromHash(final String key, final Class<T> clazz) {
        Map<Object, Object> entries = redisTemplate.opsForHash().entries(key);
        return entries.values().stream()
            .map(Object::toString)
            .map(json -> {
                try {
                    return objectMapper.readValue(json, clazz);
                } catch (JsonProcessingException e) {
                    log.error("Failed to deserialize object from key {}: {}", key, e.getMessage());
                    throw new RuntimeException(e);
                }
            })
            .collect(Collectors.toSet());
    }

    public void deleteObjectFromHash(final String key, final String subKey) {
        redisTemplate.opsForHash().delete(key, subKey);
    }

    public void deleteObjectsFromHash(final String key, final Collection<String> subKeys) {
        redisTemplate.opsForHash().delete(key, subKeys.toArray());
    }

    public void deleteAllKeysFromHash() {
        log.info("Flushing all keys from Redis");
        redisTemplate.getConnectionFactory().getConnection().flushDb();
    }

    public <T> void saveObjectAsString(final String key, final T object) {
        try {
            String json = objectMapper.writeValueAsString(object);
            redisTemplate.opsForValue().set(key, json);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize object for key {}: {}", key, e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public <T> Optional<T> getObjectAsString(final String key, final Class<T> clazz) {
        String json = redisTemplate.opsForValue().get(key);
        if (json == null) {
            return Optional.empty();
        }
        try {
            return Optional.of(objectMapper.readValue(json, clazz));
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize object for key {}: {}", key, e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public void deleteObjectAsString(final String key) {
        redisTemplate.delete(key);
    }

    public <T> List<T> getAllObjectsFromHashes(final Class<T> clazz) {
        final List<T> resultList = new ArrayList<>();
        final ScanOptions options = ScanOptions.scanOptions().count(100).build();
        try (Cursor<byte[]> cursor = redisTemplate.getConnectionFactory().getConnection().scan(options)) {
            while (cursor.hasNext()) {
                byte[] keyBytes = cursor.next();
                final String key = new String(keyBytes);

                if ("HASH".equals(redisTemplate.getConnectionFactory().getConnection().type(key.getBytes()).toString())) {
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
            log.error("Failed to retrieve objects from hashes", e);
        }

        return resultList;
    }
}
