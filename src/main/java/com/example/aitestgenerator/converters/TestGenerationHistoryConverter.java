package com.example.aitestgenerator.converters;

import com.example.aitestgenerator.dto.tests.TextGenerationHistoryDto;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface TestGenerationHistoryConverter {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "test.title", target = "testTitle")
    @Mapping(source = "test.id", target = "testId")
    @Mapping(source = "text.title", target = "textTitle")
    @Mapping(source = "text.id", target = "textId")
    @Mapping(source = "fileHash.originalFilename", target = "fileName")
    TextGenerationHistoryDto historyToDto(final TestGeneratingHistory history);
}
