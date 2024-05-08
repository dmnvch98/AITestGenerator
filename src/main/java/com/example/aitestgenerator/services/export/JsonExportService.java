package com.example.aitestgenerator.services.export;

import com.example.aitestgenerator.dto.tests.export.ExportTestRequestDto;
import com.example.aitestgenerator.models.AnswerOption;
import com.example.aitestgenerator.models.Question;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.services.export.model.ExportedTest;
import com.example.aitestgenerator.utils.Utils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Component("JSON")
@RequiredArgsConstructor
public class JsonExportService implements ExportService {

    private final ObjectMapper mapper;

    @Override
    public ExportedTest export(Test test, ExportTestRequestDto requestDto) throws IOException {
        ObjectNode rootNode = mapper.createObjectNode();

        ArrayNode questionsNode = mapper.createArrayNode();
        for (Question question : test.getQuestions()) {
            ObjectNode questionNode = mapper.createObjectNode();
            questionNode.put(requestDto.getQuestionTextLabel(), question.getQuestionText());

            ArrayNode answerOptionsNode = mapper.createArrayNode();
            for (AnswerOption answer : question.getAnswerOptions()) {
                ObjectNode answerOptionNode = mapper.createObjectNode();
                answerOptionNode.put(requestDto.getOptionTextLabel(), answer.getOptionText());
                answerOptionNode.put(requestDto.getIsCorrectLabel(), answer.getIsCorrect());
                answerOptionsNode.add(answerOptionNode);
            }

            questionNode.set(requestDto.getAnswerOptionsLabel(), answerOptionsNode);
            questionsNode.add(questionNode);
        }

        rootNode.set(requestDto.getQuestionsLabel(), questionsNode);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        mapper.writerWithDefaultPrettyPrinter().writeValue(baos, rootNode);
        return ExportedTest.builder()
                .bytes(baos.toByteArray())
                .fileName(Utils.getExportedTestName(test.getTitle(), requestDto.getExportFormat()))
                .build();
    }
}
