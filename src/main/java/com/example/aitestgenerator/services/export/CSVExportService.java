package com.example.aitestgenerator.services.export;

import com.example.aitestgenerator.dto.tests.export.ExportTestRequestDto;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.services.export.model.ExportedTest;
import com.example.aitestgenerator.utils.Utils;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.fasterxml.jackson.databind.SequenceWriter;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Component("CSV")
public class CSVExportService implements ExportService {

    private CsvMapper csvMapper;

    @PostConstruct
    private void init() {
        csvMapper = new CsvMapper();
    }

    @Override
    public ExportedTest export(Test test, ExportTestRequestDto requestDto) throws IOException {
        final CsvSchema schema = CsvSchema.builder()
                .addColumn(requestDto.getQuestionTextLabel())
                .addColumn(requestDto.getOptionTextLabel())
                .addColumn(requestDto.getIsCorrectLabel())
                .setUseHeader(true)
                .build();

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        try (SequenceWriter writer = csvMapper.writer(schema).writeValues(byteArrayOutputStream)) {
//            for (Question question : test.getQuestions()) {
//                for (AnswerOption option : question.getAnswerOptions()) {
//                    writer.write(new CsvQuestionFormat(
//                            question.getQuestionText(),
//                            option.getOptionText(),
//                            option.getIsCorrect() ? "True" : "False"
//                    ));
//                }
//            }
        }

        return ExportedTest.builder()
                .bytes(byteArrayOutputStream.toByteArray())
                .fileName(Utils.getExportedTestName(test.getTitle(), requestDto.getExportFormat()))
                .build();
    }

    @AllArgsConstructor
    public static class CsvQuestionFormat {
        public String questionText;
        public String optionText;
        public String isCorrect;
    }
}
