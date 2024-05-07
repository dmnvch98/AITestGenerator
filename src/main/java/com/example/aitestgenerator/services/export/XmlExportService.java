package com.example.aitestgenerator.services.export;

import com.example.aitestgenerator.dto.tests.export.ExportTestRequestDto;
import com.example.aitestgenerator.models.AnswerOption;
import com.example.aitestgenerator.models.Question;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.utils.Utils;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;

@Component("XML")
@RequiredArgsConstructor
public class XmlExportService implements ExportService {

    private XmlMapper xmlMapper;

    @PostConstruct
    private void init() {
        xmlMapper = new XmlMapper();
    }

    @Override
    public void export(Test test, ExportTestRequestDto requestDto) throws IOException {
        // Подготовка корневого элемента
        ObjectNode rootNode = xmlMapper.createObjectNode();

        // Создание элементов вопросов
        ArrayNode questionsNode = xmlMapper.createArrayNode();
        for (Question question : test.getQuestions()) {
            ObjectNode questionNode = xmlMapper.createObjectNode();
            questionNode.put(requestDto.getQuestionTextLabel(), question.getQuestionText());

            // Создание элементов ответов
            ArrayNode answerOptionsNode = xmlMapper.createArrayNode();
            for (AnswerOption answer : question.getAnswerOptions()) {
                ObjectNode answerOptionNode = xmlMapper.createObjectNode();
                answerOptionNode.put(requestDto.getOptionTextLabel(), answer.getOptionText());
                answerOptionNode.put(requestDto.getIsCorrectLabel(), answer.getIsCorrect());
                answerOptionsNode.add(answerOptionNode);
            }

            questionNode.set(requestDto.getAnswerOptionsLabel(), answerOptionsNode);
            questionsNode.add(questionNode);
        }

        rootNode.set(requestDto.getQuestionsLabel(), questionsNode);

        // Запись XML в файл
        final String fileName = Utils.getExportedTestName(test.getTitle(), requestDto.getExportFormat());
        xmlMapper
                .writerWithDefaultPrettyPrinter()
                .writeValue(new File(requestDto.getFilePath() + fileName), rootNode);
    }
}
