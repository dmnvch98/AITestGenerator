package com.example.generation_service.dto.tests.export;

import lombok.Builder;
import lombok.Data;
import lombok.extern.jackson.Jacksonized;

@Builder
@Jacksonized
@Data
public class ExportTestRequestDto {

    String exportFormat;
    String filePath;
    String questionsLabel;
    String questionTextLabel;
    String answerOptionsLabel;
    String optionTextLabel;
    String isCorrectLabel;

    public ExportTestRequestDto(String exportFormat, String filePath, String questionsLabel, String questionTextLabel, String answerOptionsLabel, String optionTextLabel, String isCorrectLabel) {
        this.exportFormat = exportFormat;
        this.filePath = filePath;
        this.questionsLabel = (questionsLabel == null || questionsLabel.isEmpty()) ? "questions" : questionsLabel;
        this.questionTextLabel = (questionTextLabel == null || questionTextLabel.isEmpty()) ? "questionText" : questionTextLabel;
        this.answerOptionsLabel = (answerOptionsLabel == null || answerOptionsLabel.isEmpty()) ? "answerOptions" : answerOptionsLabel;
        this.optionTextLabel = (optionTextLabel == null || optionTextLabel.isEmpty()) ? "optionText" : optionTextLabel;
        this.isCorrectLabel = (isCorrectLabel == null || isCorrectLabel.isEmpty()) ? "isCorrect" : isCorrectLabel;
    }
}
