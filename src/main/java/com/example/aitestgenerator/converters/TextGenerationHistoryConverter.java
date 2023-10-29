package com.example.aitestgenerator.converters;

import com.example.aitestgenerator.dto.tests.TextGenerationHistoryDto;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface TextGenerationHistoryConverter {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "test.id", target = "testId")
    @Mapping(source = "text.id", target = "textId")
    @Mapping(source = "generationStatus.text", target = "generationStatus")
    TextGenerationHistoryDto historyToDto(TestGeneratingHistory history);
}
