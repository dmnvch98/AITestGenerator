package com.example.generation_service.converters;

import com.example.generation_service.dto.generation.GenerateTestAllAnswersResponseDto;
import com.example.generation_service.dto.generation.GenerateTestCorrectAnswersResponseDto;
import com.example.generation_service.dto.tests.CreateTestRequestDto;
import com.example.generation_service.dto.tests.QuestionDto;
import com.example.generation_service.dto.tests.TestsResponseDto;
import com.example.generation_service.models.files.FileHash;
import com.example.generation_service.models.generation.QuestionType;
import com.example.generation_service.models.test.Question;
import com.example.generation_service.models.test.Test;
import org.apache.commons.collections4.CollectionUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.data.domain.Page;

import java.util.Collections;
import java.util.List;

@Mapper
public interface TestConverter {

    @Mapping(source = "answersDto.title", target = "title")
    @Mapping(source = "userId", target = "userId")
    @Mapping(source = "fileHash", target = "fileName", qualifiedByName = "getOriginalFilename")
    @Mapping(target = "id", ignore = true)
    Test convert(final GenerateTestCorrectAnswersResponseDto answersDto, final long userId,
                 final FileHash fileHash, final QuestionType questionsType);

//    @Mapping(source = "answersDto.title", target = "title")
//    @Mapping(source = "userId", target = "userId")
//    @Mapping(source = "fileHash", target = "fileName", qualifiedByName = "getOriginalFilename")
//    @Mapping(target = "id", ignore = true)
//    @Mapping(source = "answersDto", target = "questions", qualifiedByName = "convertAllAnswersQuestions")
//    Test convert(final GenerateTestAllAnswersResponseDto answersDto, final long userId,
//                 final FileHash fileHash, final QuestionType questionsType);

//    @Mapping(source = "answersDto.title", target = "title")
//    @Mapping(source = "userId", target = "userId")
//    @Mapping(source = "fileHash", target = "fileName", qualifiedByName = "getOriginalFilename")
//    @Mapping(target = "id", ignore = true)
//    Test convert(final List<Question> questions, final String title, final long userId, final String fileName);

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

    Question convertAllAnswersQuestion(GenerateTestAllAnswersResponseDto.QuestionDto questionDto, QuestionType questionType);

    default List<Question> convertAllAnswersQuestions(List<GenerateTestAllAnswersResponseDto.QuestionDto> questionDtos , QuestionType questionsType) {
        return questionDtos.stream()
                .map(questionDto -> convertAllAnswersQuestion(questionDto, questionsType))
                .toList();
    }

    @Mapping(source = "userId", target = "userId")
    Test convert(final CreateTestRequestDto dto, final Long userId);

    @Mapping(source = "userId", target = "userId")
    Test convert(final Test test, final Long userId);

}
