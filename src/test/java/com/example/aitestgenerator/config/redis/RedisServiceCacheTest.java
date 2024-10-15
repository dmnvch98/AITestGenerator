package com.example.aitestgenerator.config.redis;

import com.example.aitestgenerator.dto.activity.TestGenerationActivityDto;
import com.example.aitestgenerator.utils.Utils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;

import java.util.Collections;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
public class RedisServiceCacheTest {

  @Container
  private static final GenericContainer<?> redisContainer = new GenericContainer<>("redis:7.4.0")
        .withExposedPorts(6379);

  @DynamicPropertySource
  private static void registerRedisProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.redis.host", redisContainer::getHost);
    registry.add("spring.redis.port", () -> redisContainer.getMappedPort(6379).toString());
  }

  @Autowired
  private RedisTemplate<String, Object> redisTemplate;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private RedisService<TestGenerationActivityDto> redisService;

  private final Long userId = 1L;
  private final String cid = String.valueOf(System.currentTimeMillis());
  private final TestGenerationActivityDto activity =
        TestGenerationActivityDto.builder().uuid(UUID.randomUUID()).build();
  private final String hashKey = Utils.getHashKey(userId);
  private final String jsonRepresentation = "{\"uuid\":\"" + activity.getUuid() + "\"}"; // пример JSON

  @BeforeEach
  public void setUp() {
    // Сохраняем активность в Redis перед каждым тестом
    redisService.saveUserActivity(userId, cid, activity);
  }

  @AfterEach
  public void tearDown() {
    // Очищаем базу данных Redis после каждого теста
    redisTemplate.getConnectionFactory().getConnection().flushDb();
  }

  @Test
  public void testCachingActivity() {
    // Создаем мок для HashOperations
    HashOperations<String, String, String> hashOperations = mock(HashOperations.class);
    when(redisTemplate.opsForHash()).thenReturn(hashOperations);

    // Настраиваем возврат значений из мока
    when(hashOperations.entries(hashKey)).thenReturn(Collections.singletonMap(cid, jsonRepresentation));

    // Получаем данные первый раз
    Set<TestGenerationActivityDto> userActivities =
          redisService.getUserActivities(hashKey, TestGenerationActivityDto.class);

    // Получаем данные второй раз
    Set<TestGenerationActivityDto> userActivities2 =
          redisService.getUserActivities(hashKey, TestGenerationActivityDto.class);

    // Проверяем, что оба вызова возвращают одинаковые результаты
    assertEquals(userActivities.size(), 1); // Ожидаем 1 элемент
    assertEquals(userActivities2.size(), 1); // Ожидаем 1 элемент

    // Проверяем, что метод opsForHash().entries() был вызван только один раз
    verify(hashOperations, times(1)).entries(hashKey);
  }
}
