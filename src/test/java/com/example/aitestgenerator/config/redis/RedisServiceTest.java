package com.example.aitestgenerator.config.redis;

import com.example.aitestgenerator.models.TestGenerationActivity;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;


@Testcontainers
@SpringBootTest
@ExtendWith(SpringExtension.class)
public class RedisServiceTest {

  @Container
  private static final GenericContainer<?> redisContainer = new GenericContainer<>("redis:7.4.0")
        .withExposedPorts(6379);

  @DynamicPropertySource
  private static void registerRedisProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.redis.host", redisContainer::getHost);
    registry.add("spring.redis.port", () -> redisContainer.getMappedPort(6379).toString());
  }

  @Autowired
  private RedisService<TestGenerationActivity> redisService;
  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private RedisTemplate<String, Object> redisTemplate;

  @BeforeEach
  public void setUp() {
    redisTemplate.getConnectionFactory().getConnection().ping();
  }

  @Test
  public void testSaveAndGetUserActivity() {

  }
}