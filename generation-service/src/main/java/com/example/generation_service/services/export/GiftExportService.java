package com.example.generation_service.services.export;

import com.example.generation_service.dto.tests.AnswerOptionDto;
import com.example.generation_service.dto.tests.export.ExportTestRequestDto;
import com.example.generation_service.models.test.Question;
import com.example.generation_service.models.test.Test;
import com.example.generation_service.services.export.model.ExportedTest;
import com.example.generation_service.utils.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RequiredArgsConstructor
@Component("Gift")
public class GiftExportService implements ExportService {

  private static final String EXTENSION = ".txt";

  @Override
  public ExportedTest export(Test test, ExportTestRequestDto requestDto) {
    final StringBuilder giftFormat = new StringBuilder();

    for (Question question : test.getQuestions()) {
      List<AnswerOptionDto> answers = question.getAnswerOptions();
      final String questionText = question.getQuestionText();

      switch (question.getQuestionType()) {
        case MULTIPLE_CHOICE_MULTIPLE_ANSWERS -> appendMultipleChoiceAnswers(giftFormat, questionText, answers);
        case MULTIPLE_CHOICE_SINGLE_ANSWER, TRUE_FALSE ->  appendSingleChoiceAnswers(giftFormat, questionText, answers);
        case FILL_IN_THE_BLANKS ->  appendFillInTheBlanksAnswer(giftFormat, questionText, answers);
      }

    }

    if (giftFormat.length() > 2) {
      giftFormat.setLength(giftFormat.length() - 2);
    }

    final byte[] giftBytes = giftFormat.toString().getBytes(StandardCharsets.UTF_8);
    final String fileName = test.getTitle() + EXTENSION;

    return ExportedTest.builder()
          .bytes(giftBytes)
          .fileName(fileName)
          .build();
  }

  private void appendSingleChoiceAnswers(StringBuilder giftFormat, String questionText, List<AnswerOptionDto> answers) {
    giftFormat.append(questionText).append(" {\n");
    for (AnswerOptionDto answer : answers) {
      String optionText = answer.getOptionText();
      if (answer.getIsCorrect()) {
        giftFormat.append("  =").append(optionText).append("\n");
      } else {
        giftFormat.append("  ~").append(optionText).append("\n");
      }
    }
    giftFormat.append("}\n\n");

  }

  private void appendMultipleChoiceAnswers(StringBuilder giftFormat, String questionText, List<AnswerOptionDto> answers) {
    giftFormat.append(questionText).append(" {\n");
    long correctAnswersCount = answers.stream().filter(AnswerOptionDto::getIsCorrect).count();
    long incorrectAnswersCount = answers.size() - correctAnswersCount;

    double scorePerCorrectAnswer = Utils.round(100.0 / correctAnswersCount, 5);
    double penaltyPerIncorrectAnswer = Utils.round(- (100.0 / (correctAnswersCount + incorrectAnswersCount)), 5);

    for (AnswerOptionDto answer : answers) {
      String optionText = answer.getOptionText();
      if (answer.getIsCorrect()) {
        giftFormat.append("  ~%").append(scorePerCorrectAnswer).append("%").append(optionText).append("\n");
      } else {
        giftFormat.append("  ~%").append(penaltyPerIncorrectAnswer).append("%").append(optionText).append("\n");
      }
    }
    giftFormat.append("}\n\n");
  }

  private void appendFillInTheBlanksAnswer(StringBuilder giftFormat, String questionText, List<AnswerOptionDto> answers) {
    if (!questionText.contains("_")) {
      throw new IllegalArgumentException("FILL_IN_THE_BLANKS question must contain exactly one '_____'.");
    }

    if (answers == null || answers.isEmpty()) {
      throw new IllegalArgumentException("FILL_IN_THE_BLANKS question must have at least one answer option.");
    }

    StringBuilder options = new StringBuilder("{");
    boolean hasCorrectAnswer = false;

    for (AnswerOptionDto answer : answers) {
      String optionText = answer.getOptionText().trim();
      if (answer.getIsCorrect()) {
        options.append("=").append(optionText).append(" ");
        hasCorrectAnswer = true;
      } else {
        options.append("~").append(optionText).append(" ");
      }
    }

    if (!hasCorrectAnswer) {
      throw new IllegalArgumentException("FILL_IN_THE_BLANKS question must have at least one correct answer.");
    }

    if (options.length() > 1) {
      options.setLength(options.length() - 1);
    }
    options.append("}");

    String updatedQuestionText = questionText.replaceFirst("_+", options.toString());

    giftFormat.append(updatedQuestionText).append("\n\n");
  }


}
