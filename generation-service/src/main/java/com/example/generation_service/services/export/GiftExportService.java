package com.example.generation_service.services.export;

import com.example.generation_service.dto.tests.AnswerOptionDto;
import com.example.generation_service.dto.tests.QuestionDto;
import com.example.generation_service.dto.tests.export.ExportTestRequestDto;
import com.example.generation_service.models.test.Test;
import com.example.generation_service.services.export.model.ExportedTest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RequiredArgsConstructor
@Component("Gift")
public class GiftExportService implements ExportService {

  private static final String EXTENSION = ".txt";

  @Override
  public ExportedTest export(Test test, ExportTestRequestDto requestDto) throws IOException {
    final StringBuilder giftFormat = new StringBuilder();

    for (QuestionDto question : test.getQuestions()) {
      final String questionText = question.getQuestionText();
      giftFormat.append(questionText).append(" {\n");

      List<AnswerOptionDto> answers = question.getAnswerOptions();
      long correctAnswersCount = answers.stream().filter(AnswerOptionDto::isCorrect).count();

      if (correctAnswersCount > 1) {
        appendMultipleChoiceAnswers(giftFormat, answers);
      } else {
        appendSingleChoiceAnswers(giftFormat, answers);
      }

      giftFormat.append("}\n\n");
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

  private void appendSingleChoiceAnswers(StringBuilder giftFormat, List<AnswerOptionDto> answers) {
    for (AnswerOptionDto answer : answers) {
      String optionText = answer.getOptionText();
      if (answer.isCorrect()) {
        giftFormat.append("  =").append(optionText).append("\n"); // Правильный ответ
      } else {
        giftFormat.append("  ~").append(optionText).append("\n"); // Неправильный ответ
      }
    }
  }

  private void appendMultipleChoiceAnswers(StringBuilder giftFormat, List<AnswerOptionDto> answers) {
    long correctAnswersCount = answers.stream().filter(AnswerOptionDto::isCorrect).count();
    long incorrectAnswersCount = answers.size() - correctAnswersCount;

    // Рассчитываем процентные баллы для правильных ответов
    double scorePerCorrectAnswer = 100.0 / correctAnswersCount;
    // Рассчитываем штраф за неправильные ответы
    double penaltyPerIncorrectAnswer = - (100.0 / (correctAnswersCount + incorrectAnswersCount));

    for (AnswerOptionDto answer : answers) {
      String optionText = answer.getOptionText();
      if (answer.isCorrect()) {
        giftFormat.append("  ~%").append((int) scorePerCorrectAnswer).append("%").append(optionText).append("\n");
      } else {
        // Для неправильных ответов добавляем штраф
        giftFormat.append("  ~%").append((int) penaltyPerIncorrectAnswer).append("%").append(optionText).append("\n");
      }
    }
  }

}
