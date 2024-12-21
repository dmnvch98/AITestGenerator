package com.example.generation_service.converters;

import com.example.generation_service.dto.generation.GenerateTestCorrectAnswersResponseDto;
import com.example.generation_service.dto.generation.GenerateTestIncorrectAnswersResponseDto;
import com.example.generation_service.dto.tests.upsert.GetTestResponseDto;
import com.example.generation_service.dto.tests.upsert.UpsertTestAnswerOptionRequestDto;
import com.example.generation_service.dto.tests.upsert.UpsertTestQuestionRequestDto;
import com.example.generation_service.dto.tests.upsert.UpsertTestRequestDto;
import com.example.generation_service.dto.tests.TestsResponseDto;
import com.example.generation_service.models.files.FileHash;
import com.example.generation_service.models.generation.QuestionType;
import com.example.generation_service.models.test.AnswerOption;
import com.example.generation_service.models.test.Question;
import com.example.generation_service.models.test.Test;
import org.apache.commons.collections4.CollectionUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.data.domain.Page;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper
public interface TestConverter {

    @Mapping(source = "answersDto.title", target = "title")
    @Mapping(source = "userId", target = "userId")
    @Mapping(source = "fileHash", target = "fileName", qualifiedByName = "getOriginalFilename")
    @Mapping(target = "id", ignore = true)
    Test convert(final GenerateTestCorrectAnswersResponseDto answersDto, final long userId,
                 final FileHash fileHash, final QuestionType questionsType);

    @Mapping(source = "title", target = "title")
    @Mapping(source = "userId", target = "userId")
    @Mapping(source = "fileName", target = "originalFileName")
    @Mapping(target = "id", ignore = true)
    default Test convert(final List<Question> questions, final String title, final long userId,
                 final String originalFileName) {
        return Test.builder()
                .title(title)
                .questions(questions)
                .userId(userId)
                .fileName(originalFileName)
                .build();
    }

    TestsResponseDto.TestResponseDto convert(final Test test);

    default TestsResponseDto convert(final List<Test> tests) {
        return TestsResponseDto.builder()
              .tests(tests.stream().map(this::convert).toList())
              .build();
    }

    default TestsResponseDto convert(final Page<Test> pageTest) {
        return TestsResponseDto.builder()
                .tests(pageTest.getContent().stream().map(this::convert).toList())
                .totalPages(pageTest.getTotalPages())
                .totalElements(pageTest.getTotalElements())
                .build();
    }

    @Named("getOriginalFilename")
    default String getFileHashId(final FileHash fileHash) {
        return fileHash.getOriginalFilename();
    }

    default List<Question> convertAllAnswersQuestions(
            final GenerateTestIncorrectAnswersResponseDto incorrectAnswersDto,
            final GenerateTestCorrectAnswersResponseDto correctAnswersDto,
            QuestionType questionsType) {
            List<Question> resultQuestions = new ArrayList<>();

            var correctAnswersMap = correctAnswersDto.getQuestions().stream()
                    .collect(Collectors.toMap(
                            GenerateTestCorrectAnswersResponseDto.QuestionDto::getId,
                            questionDto -> questionDto
                    ));

            for (var incorrectQuestion : incorrectAnswersDto.getQuestions()) {
                var correctQuestion = correctAnswersMap.get(incorrectQuestion.getId());

                if (correctQuestion != null) {
                    List<AnswerOption> answerOptions = new ArrayList<>();

                    answerOptions.addAll(correctQuestion.getCorrectAnswers().stream()
                            .map(answer -> AnswerOption.builder()
                                    .optionText(answer.toString())
                                    .correct(true)
                                    .build())
                            .toList());

                    answerOptions.addAll(incorrectQuestion.getIncorrectAnswers().stream()
                            .map(answer -> AnswerOption.builder()
                                    .optionText(answer)
                                    .correct(false)
                                    .build())
                            .toList());

                    if (CollectionUtils.isNotEmpty(answerOptions)) {
                        Collections.shuffle(answerOptions);
                    }

                    Question question = Question.builder()
                            .questionText(correctQuestion.getQuestionText())
                            .answerOptions(answerOptions)
                            .textReference(correctQuestion.getTextReference())
                            .questionType(questionsType)
                            .build();

                    resultQuestions.add(question);
                }
            }
            return resultQuestions;
    }

    @Mapping(source = "dto.questions", target = "questions", qualifiedByName = "convertQuestions")
    Test convert(final UpsertTestRequestDto dto, final Long userId);

    @Named("convertQuestions")
    default List<Question> convertQuestions(final List<UpsertTestQuestionRequestDto> questionDtos) {
        return questionDtos.stream()
                .map(this::convertQuestion)
                .toList();
    }

    @Mapping(source = "questionDto.answerOptions", target = "answerOptions", qualifiedByName = "convertAnswerOptions")
    Question convertQuestion(final UpsertTestQuestionRequestDto questionDto);

    @Named("convertAnswerOptions")
    default List<AnswerOption> convertAnswerOptions(final List<UpsertTestAnswerOptionRequestDto> questionDtos) {
        return questionDtos.stream()
                .map(this::convertAnswerOption)
                .toList();
    }

    AnswerOption convertAnswerOption(final UpsertTestAnswerOptionRequestDto answerOption);

    @Mapping(source = "userId", target = "userId")
    Test convert(final Test test, final Long userId);

    GetTestResponseDto convertTest(final Test test);

}
