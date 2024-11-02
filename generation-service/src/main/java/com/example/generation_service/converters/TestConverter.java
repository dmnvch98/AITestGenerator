package com.example.generation_service.converters;

import com.example.generation_service.dto.generation.GenerateAnswersResponseDto;
import com.example.generation_service.dto.tests.CreateTestRequestDto;
import com.example.generation_service.dto.tests.TestsResponseDto;
import com.example.generation_service.models.FileHash;
import com.example.generation_service.models.Test;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.data.domain.Page;

import java.util.List;

@Mapper
public interface TestConverter {

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

    default TestsResponseDto convert(final Page<Test> pageTest) {
        return TestsResponseDto.builder()
                .tests(pageTest.getContent().stream().map(this::convert).toList())
                .totalPages(pageTest.getTotalPages())
                .totalElements(pageTest.getNumberOfElements())
                .build();
    }

    @Named("getOriginalFilename")
    default String getFileHashId(final FileHash fileHash) {
        return fileHash.getOriginalFilename();
    }

    @Mapping(source = "userId", target = "userId")
    Test convert(final CreateTestRequestDto dto, final Long userId);

    @Mapping(source = "userId", target = "userId")
    Test convert(final Test test, final Long userId);

}
