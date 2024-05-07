package com.example.aitestgenerator.services.export;

import com.example.aitestgenerator.dto.tests.export.ExportTestRequestDto;
import com.example.aitestgenerator.models.AnswerOption;
import com.example.aitestgenerator.models.Question;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.utils.Utils;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.fasterxml.jackson.databind.SequenceWriter;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;

@Component("CSV")
public class CSVExportService implements ExportService {

    private CsvMapper csvMapper;

    @PostConstruct
    private void init() {
        csvMapper = new CsvMapper();
    }

    @Override
    public void export(Test test, ExportTestRequestDto requestDto) throws IOException {
        // Создаем схему с заголовками
        final CsvSchema schema = CsvSchema.builder()
                .addColumn(requestDto.getQuestionTextLabel())
                .addColumn(requestDto.getOptionTextLabel())
                .addColumn(requestDto.getIsCorrectLabel())
                .setUseHeader(true)  // Указываем, что нужно использовать заголовок
                .build();

        final String fileName = Utils.getExportedTestName(test.getTitle(), requestDto.getExportFormat());
        final File outputFile = new File(requestDto.getFilePath() + fileName);
        // Пишем данные в файл, используя созданную схему
        try (SequenceWriter writer = csvMapper.writer(schema).writeValues(outputFile)) {
            for (Question question : test.getQuestions()) {
                for (AnswerOption option : question.getAnswerOptions()) {
                    writer.write(new CsvQuestionFormat(
                            question.getQuestionText(),
                            option.getOptionText(),
                            option.getIsCorrect() ? "True" : "False"
                    ));
                }
            }
        }
    }

    // Вспомогательный класс для форматирования данных в CSV
    @AllArgsConstructor
    public static class CsvQuestionFormat {
        public String questionText;
        public String optionText;
        public String isCorrect;
    }
}
