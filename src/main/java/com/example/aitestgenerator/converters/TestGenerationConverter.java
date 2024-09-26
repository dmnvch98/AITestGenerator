package com.example.aitestgenerator.converters;

import com.example.aitestgenerator.dto.tests.GenerateTestRequestDto;
import com.example.aitestgenerator.dto.tests.TextGenerationHistoryDto;
import com.example.aitestgenerator.generators.models.GenerateTestRequest;
import com.example.aitestgenerator.models.FileHash;
import com.example.aitestgenerator.models.GenerateTestMessage;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.User;
import com.example.aitestgenerator.models.enums.GenerationStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.LocalDateTime;

@Mapper
public interface TestGenerationConverter {

  @Mapping(source = "user.id", target = "userId")
  @Mapping(source = "test.title", target = "testTitle")
  @Mapping(source = "test.id", target = "testId")
  TextGenerationHistoryDto historyToDto(final TestGeneratingHistory history);

  default TestGeneratingHistory getWaiting(final User user) {
    return TestGeneratingHistory.builder()
          .user(user)
          .generationStatus(GenerationStatus.WAITING)
          .build();
  }

  default TestGeneratingHistory getInProcess(final TestGeneratingHistory history, final String receipt) {
    return history
          .toBuilder()
          .generationStatus(GenerationStatus.IN_PROCESS)
          .generationStart(LocalDateTime.now())
          .messageReceipt(receipt)
          .build();
  }

  @Mapping(source = "userId", target = "userId")
  @Mapping(source = "historyId", target = "historyId")
  @Mapping(source = "hashedFileName", target = "hashedFileName")
  GenerateTestMessage convert(final GenerateTestRequestDto dto, final String hashedFileName, final Long userId,
                              final Long historyId);

  @Mapping(source = "userId", target = "userId")
  @Mapping(source = "history", target = "history")
  @Mapping(source = "fileHash", target = "fileHash")
  @Mapping(source = "text", target = "text")
  GenerateTestRequest convert(final GenerateTestMessage message, final TestGeneratingHistory history, final String text,
                              final long userId, final FileHash fileHash);

}
