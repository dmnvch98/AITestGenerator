package com.example.aitestgenerator.converters;

import com.example.aitestgenerator.dto.generation.GenerateAnswersResponseDto;
import com.example.aitestgenerator.dto.tests.CreateTestRequestDto;
import com.example.aitestgenerator.dto.tests.TestsResponseDto;
import com.example.aitestgenerator.models.FileHash;
import com.example.aitestgenerator.models.Test;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper
public interface TestConverter {

    @Mapping(source = "answersDto.questions", target = "questions")
    @Mapping(source = "answersDto.title", target = "title")
    @Mapping(source = "problems", target = "problems")
    @Mapping(source = "userId", target = "userId")
    @Mapping(source = "fileHash", target = "fileName", qualifiedByName = "getOriginalFilename")
    Test convert(final GenerateAnswersResponseDto answersDto,
                 final String problems, final long userId,
                 final FileHash fileHash);

    TestsResponseDto.TestResponseDto convert(final Test test);

    default TestsResponseDto convert(final List<Test> tests) {
        return TestsResponseDto.builder()
              .tests(tests.stream().map(this::convert).toList())
              .build();
    }

    @Named("getOriginalFilename")
    default String getFileHashId(final FileHash fileHash) {
        return fileHash.getOriginalFilename();
    }

    Test convert(final CreateTestRequestDto dto);
}
