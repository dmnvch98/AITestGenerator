package com.example.aitestgenerator.converters;

import com.example.aitestgenerator.dto.generation.GenerateAnswersResponseDto;
import com.example.aitestgenerator.models.FileHash;
import com.example.aitestgenerator.models.Test;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface TestConverter {

    @Mapping(source = "answersDto.questions", target = "questions")
    @Mapping(source = "answersDto.title", target = "title")
    @Mapping(source = "problems", target = "problems")
    @Mapping(source = "userId", target = "userId")
    @Mapping(source = "fileHash", target = "fileHash")
    Test convert(final GenerateAnswersResponseDto answersDto,
                 final String problems, final long userId,
                 final FileHash fileHash);

}
