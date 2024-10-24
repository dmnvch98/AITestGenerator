package com.example.generation_service.services.export;

import com.example.generation_service.dto.tests.export.ExportTestRequestDto;
import com.example.generation_service.models.Test;
import com.example.generation_service.services.export.model.ExportedTest;
import com.example.generation_service.utils.Utils;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
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
    public ExportedTest export(Test test, ExportTestRequestDto requestDto) throws IOException {
        ObjectNode rootNode = xmlMapper.createObjectNode();

        ArrayNode questionsNode = xmlMapper.createArrayNode();
//        for (Question question : test.getQuestions()) {
//            ObjectNode questionNode = xmlMapper.createObjectNode();
//            questionNode.put(requestDto.getQuestionTextLabel(), question.getQuestionText());
//
//            ArrayNode answerOptionsNode = xmlMapper.createArrayNode();
//            for (AnswerOption answer : question.getAnswerOptions()) {
//                ObjectNode answerOptionNode = xmlMapper.createObjectNode();
//                answerOptionNode.put(requestDto.getOptionTextLabel(), answer.getOptionText());
//                answerOptionNode.put(requestDto.getIsCorrectLabel(), answer.getIsCorrect());
//                answerOptionsNode.add(answerOptionNode);
//            }
//
//            questionNode.set(requestDto.getAnswerOptionsLabel(), answerOptionsNode);
//            questionsNode.add(questionNode);
//        }

        rootNode.set(requestDto.getQuestionsLabel(), questionsNode);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        xmlMapper.writerWithDefaultPrettyPrinter().writeValue(baos, rootNode);

        return ExportedTest.builder()
                .bytes(baos.toByteArray())
                .fileName(Utils.getExportedTestName(test.getTitle(), requestDto.getExportFormat()))
                .build();
    }
}
