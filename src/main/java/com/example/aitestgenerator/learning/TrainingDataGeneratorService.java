package com.example.aitestgenerator.learning;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.aitestgenerator.dto.generation.GenerateQuestionsRequestDto;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

@Service
public class TrainingDataGeneratorService {

    @Autowired
    private QuestionLearningDataRep questionLearningDataRep;

    private final String context = "Это академический чат-бот, который генерирует вопросы на основе предоставленного текста. Эти вопросы затем используются в тесте с вариантами ответов. Ответ должен быть точно в формате JSON: {\\\"problems\\\":\\\"\\\",\\\"title\\\":\\\"\\\",\\\"questions\\\":[{\\\"questionText\\\":\\\"\\\"}]}. В поле 'problems' указываются случаи, когда количество указанных вопросов не совпадает с количеством уникальных. Максимальное количество вопросов указано в поле \\\"maxQuestionsCount\\\". Если полея \\\"maxQuestionsCount\\\" не присутсвтует в запросе, это значит что ограничений нет и ты должен сгенерировать максимальное количество вопросов охватывающие ключевые идеи текста.";

    private final ObjectMapper objectMapper = new ObjectMapper();

    public void generateTrainingDataFile() throws IOException {
        List<QuestionsLearningData> allData = (List<QuestionsLearningData>) questionLearningDataRep.findAll();
//        final List<QuestionsLearningData> allData = (List<QuestionsLearningData>) questionLearningDataRep.findAllById(List.of(18L));

        try (FileWriter fileWriter = new FileWriter("fine_tuning/learn_questions_data.jsonl")) {
            for (QuestionsLearningData data : allData) {

                final GenerateQuestionsRequestDto userRequest = createGenerateQuestionsRequestDto(data);

                final ChatMessage useMessage = ChatMessage.builder()
                        .content(objectMapper.writeValueAsString(userRequest))
                        .role("user")
                        .build();

                final ChatMessage systemMessage = ChatMessage.builder()
                        .content(context)
                        .role("system")
                        .build();

                final ChatMessage assistantMessage = ChatMessage.builder()
                        .content(createAssistantMessage(data))
                        .role("assistant")
                        .build();

                final Row row = Row.builder().messages(List.of(systemMessage, useMessage, assistantMessage)).build();
                // 4. Записываем результат в файл
                fileWriter.write(objectMapper.writeValueAsString(row) + "\n");
            }
        }
    }

    private GenerateQuestionsRequestDto createGenerateQuestionsRequestDto(QuestionsLearningData data) {
        // Создание DTO на основе данных из базы
        return GenerateQuestionsRequestDto.builder()
                .text(data.getText()) // Текст из базы данных с экранированием
                .maxQuestionsCount(data.getMaxQuestions() != null ? data.getMaxQuestions() : null) // Максимальное количество вопросов
                .build();
    }

    private String createAssistantMessage(QuestionsLearningData data) throws IOException {
        final String problems = data.getProblems();

        final QuestionResponse questionResponse = QuestionResponse.builder()
                .problems(problems)
                .questions(data.getQuestions())
                .build();
        return objectMapper.writeValueAsString(questionResponse);
    }


    @Builder
    @Jacksonized
    @Getter
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class QuestionResponse {

        private final String questions;
        private final String problems;
    }

    @Builder
    @Jacksonized
    @Getter
    private static class ChatMessage {

        private final String role;
        private final String content;
    }

    @Builder
    @Jacksonized
    @Getter
    private static class Row {

        private final List<ChatMessage> messages;
    }
}
