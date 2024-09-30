package com.example.aitestgenerator.services;

import com.example.aitestgenerator.services.ai.AIService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.theokanning.openai.completion.chat.ChatMessage;
import lombok.SneakyThrows;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class ChatGPTServiceParallelTest {

  @Autowired
  private AIService chatGPTService;

  @Autowired
  private ObjectMapper mapper;

  String schemaJson = """
        {
          "name": "chat_message_schema",
          "schema": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              },
              "role": {
                "type": "string",
                "enum": ["user", "assistant"]
              },
              "content": {
                "type": "string"
              }
            },
            "required": ["id", "role", "content"]
          }
        }
        """;

  @Test
  @SneakyThrows
  public void testParallelSendCalls() {
    JsonNode schema = mapper.readTree(schemaJson);
    int parallelCalls = 5; // количество параллельных вызовов
    ExecutorService executorService = Executors.newFixedThreadPool(parallelCalls);
    List<Callable<String>> tasks = new ArrayList<>();

    // Создание задачи для параллельного выполнения
    for (int i = 0; i < parallelCalls; i++) {
      tasks.add(() -> {
        List<ChatMessage> messages = List.of(new ChatMessage("user", "Привет как твои дела, ковбой? я соскучился"));
        // Параметры для метода send, подставьте ваши значения
        return chatGPTService.send("gpt-4o-mini", messages, schema, 0.5, 0.8);
      });
    }

    // Выполнение задач параллельно
    List<Future<String>> futures = executorService.invokeAll(tasks);

    // Проверка результатов
    for (Future<String> future : futures) {
      String response = future.get();
      assertNotNull(response);
      System.out.println("Response: " + response);
    }

    executorService.shutdown();
  }
}
