package com.example.aitestgenerator.services;

import com.example.aitestgenerator.interfaces.CheckableForEmptiness;
import com.example.aitestgenerator.models.AnswerOption;
import com.example.aitestgenerator.models.Chapter;
import com.example.aitestgenerator.models.Question;
import com.example.aitestgenerator.models.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
@Disabled
class TestServiceTest {

    @Autowired
    TestService testService;

    @Autowired
    UserService userService;

    @Autowired
    ChapterService chapterService;
    @Autowired
    ObjectMapper objectMapper;

    @Test
    void saveTest() {
        User user = userService.findUserById(5L);

        com.example.aitestgenerator.models.Test test = com.example.aitestgenerator.models.Test.builder()
            .title("Артефакты и настройки для создания приложения на Spring с использованием Maven")
            .user(user)
            .build();

        AnswerOption answerOption = AnswerOption.builder()
            .optionText("Файл pom.xml и конфигурационные файлы Spring")
            .isCorrect(true)
            .build();

        AnswerOption answerOption1 = AnswerOption.builder()
            .optionText("Файл pom.xml и исходный код приложения")
            .isCorrect(false)
            .build();

        Question question = Question.builder()
            .questionText("Для создания приложения на Spring с использованием Maven вам понадобятся следующие артефакты и настройки:")
            .answerOptions(List.of(answerOption1, answerOption))
            .test(test)
            .build();

        test.setQuestions(List.of(question));
        answerOption.setQuestion(question);
        answerOption1.setQuestion(question);

        com.example.aitestgenerator.models.Test savedTest = testService.saveTest(test);

        assertFalse(savedTest.isEmpty());

        assertFalse(savedTest.getQuestions()
            .stream()
            .flatMap(q -> q.getAnswerOptions().stream())
            .allMatch(CheckableForEmptiness::isEmpty));
    }

    @Test
    public void mapResponseToTest() throws JsonProcessingException {
        String filePath = "/Users/Yauhen/Library/Application Support/JetBrains/IntelliJIdea2022.3/scratches/test.json";
        String json = readFileContents(filePath);

        assertNotNull(json);

        com.example.aitestgenerator.models.Test testObject =
            objectMapper.readValue(json, com.example.aitestgenerator.models.Test.class);

        assertNotNull(testObject);

        testObject.getQuestions().forEach(question -> question.setTest(testObject)); // Установка связи между Test и Question
        testObject.getQuestions().forEach(question -> {
            question.getAnswerOptions().forEach(answerOption -> answerOption.setQuestion(question)); // Установка связи между Question и AnswerOption
        });

        com.example.aitestgenerator.models.Test savedTest = testService.saveTest(testObject);

        assertFalse(savedTest.isEmpty());

        assertFalse(savedTest.getQuestions()
            .stream()
            .flatMap(q -> q.getAnswerOptions().stream())
            .allMatch(CheckableForEmptiness::isEmpty));
    }

    @Test
    public void testGenerateTest() throws JsonProcessingException {
        Chapter chapter = chapterService.findAllById(5L);

        com.example.aitestgenerator.models.Test test = testService.generateTest(chapter, 4, null);

        assertNotNull(test);
        test = testService.saveTest(test);
        assertNotNull(test);
    }

    public static String readFileContents(String filePath) {
        try {
            return Files.readString(Path.of(filePath));
        } catch (IOException e) {
            log.error("An error occurred while reading the file: {}", e.getMessage());
        }
        return null;
    }
}