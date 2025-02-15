package com.example.generation_service.services.redis;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class RedisService {

    @Getter
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    public <T> void saveObjectToHash(final String key, final String subKey, final T object, String counterName) {
        try {
            final Boolean exists = redisTemplate.opsForHash().hasKey(key, subKey);

            final String json = objectMapper.writeValueAsString(object);
            redisTemplate.opsForHash().put(key, subKey, json);
            if (!exists) {
                redisTemplate.opsForValue().increment(counterName);
            }
        } catch (Exception e) {
            if (e instanceof RedisConnectionFailureException) {
                log.error("Redis connection failure");
                return;
            }
            log.error("Failed to serialize object for key {}: {}", key, e.getMessage());
        }
    }

    public <T> Optional<T> getObjectFromHash(final String key, final String subKey, final Class<T> clazz) {
        try {
            final Object json = redisTemplate.opsForHash().get(key, subKey);
            if (json == null) {
                return Optional.empty();
            }
            try {
                return Optional.of(objectMapper.readValue(json.toString(), clazz));
            } catch (Exception e) {
                log.error("Failed to deserialize object for key {}: {}", key, e.getMessage());
                return Optional.empty();
            }
        } catch (final Exception e) {
            if (e instanceof RedisConnectionFailureException) {
                log.error("Redis connection failure");
                return Optional.empty();
            }
            log.error("Cannot get object from hash: {}", key, e);
        }
        return Optional.empty();
    }

    public <T> Set<T> getAllObjectsFromHash(final String key, final Class<T> clazz) {
        try {
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
        } catch (final Exception e) {
            if (e instanceof RedisConnectionFailureException) {
                log.error("Redis connection failure");
                return Collections.emptySet();
            }
            log.error("An error occurred when getting user activities: {}", key, e);
        }
        return Collections.emptySet();
    }

    public void deleteObjectFromHash(final String key, final String subKey, final String counterKey) {
        redisTemplate.opsForValue().decrement(counterKey);

        redisTemplate.opsForHash().delete(key, subKey);
    }

    public void deleteObjectsFromHash(final String key, final Collection<String> subKeys, final String counterKey) {
        redisTemplate.opsForValue().decrement(counterKey, subKeys.size());

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
        } catch (Exception e) {
            if (e instanceof RedisConnectionFailureException) {
                log.error("Redis connection failure");
            }
            log.error("Failed to serialize object for key {}: {}", key, e.getMessage());
        }
    }

    public <T> void saveObjectAsString(final String key, final T object, final long ttlSeconds) {
        try {
            String json = objectMapper.writeValueAsString(object);
            redisTemplate.opsForValue().set(key, json, ttlSeconds, TimeUnit.SECONDS);
        } catch (Exception e) {
            if (e instanceof RedisConnectionFailureException) {
                log.error("Redis connection failure");
            }
            log.error("Failed to serialize object for key {}: {}", key, e.getMessage());
        }
    }

    public <T> Optional<T> getObjectAsString(final String key, final Class<T> clazz) {
        String json = redisTemplate.opsForValue().get(key);
        if (json == null) {
            return Optional.empty();
        }
        try {
            return Optional.of(objectMapper.readValue(json, clazz));
        } catch (Exception e) {
            if (e instanceof RedisConnectionFailureException) {
                log.error("Redis connection failure");
                return Optional.empty();
            }
            log.error("Failed to deserialize object for key {}: {}", key, e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public void deleteObjectAsString(final String key) {
        try {
            redisTemplate.delete(key);
        } catch (Exception e) {
            if (e instanceof RedisConnectionFailureException) {
                log.error("Redis connection failure");
                return;
            }
            log.error("Failed to deserialize object for key {}: {}", key, e.getMessage());
            throw new RuntimeException(e);
        }
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

    public long getKeyCount(String counterKey) {
        final String count = redisTemplate.opsForValue().get(counterKey);
        if (count != null) {
            return Long.parseLong(count);
        }
        return 0;
    }
}
