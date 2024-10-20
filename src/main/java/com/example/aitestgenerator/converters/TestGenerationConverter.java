package com.example.aitestgenerator.converters;

import com.example.aitestgenerator.models.TestGenerationActivity;
import com.example.aitestgenerator.dto.tests.GenerateTestRequestDto;
import com.example.aitestgenerator.dto.tests.TextGenerationHistoryDto;
import com.example.aitestgenerator.exceptionHandler.enumaration.GenerationFailReason;
import com.example.aitestgenerator.generators.models.GenerateTestRequest;
import com.example.aitestgenerator.models.*;
import com.example.aitestgenerator.models.enums.ActivityStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDateTime;
import java.util.Optional;

@Mapper
public interface TestGenerationConverter {

  @Mapping(source = "failReason", target = "failCode", qualifiedByName = "convertFailReason")
  TextGenerationHistoryDto historyToDto(final TestGeneratingHistory history);


  @Mapping(source = "userId", target = "userId")
  @Mapping(source = "dto.hashedFileName", target = "hashedFileName")
  @Mapping(source = "cid", target = "cid")
  @Mapping(source = "hashKey", target = "hashKey")
  GenerateTestMessage convert(final GenerateTestRequestDto dto, final Long userId, final String hashKey, final String cid);

  @Mapping(source = "fileHash", target = "fileHash")
  @Mapping(source = "text", target = "text")
  @Mapping(source = "message.userId", target = "userId")
  GenerateTestRequest convert(final GenerateTestMessage message, final String text, final FileHash fileHash);

  @Named("convertFailReason")
  default Integer convertFailReason(final String failReason) {
    return Optional.ofNullable(failReason)
          .map(GenerationFailReason::getFailCode)
          .orElse(null);
  }

  default TestGeneratingHistory getSuccessHistory(final TestGenerationActivity activity, final Test test) {
    return TestGeneratingHistory.builder()
       .testId(test.getId())
       .testTitle(test.getTitle())
       .startDate(activity.getStartDate())
       .endDate(LocalDateTime.now())
       .cid(activity.getCid())
       .fileName(activity.getFileName())
       .userId(test.getUserId())
       .status(ActivityStatus.SUCCESS)
       .requestDto(activity.getRequestDto())
       .build();
  }

  default TestGeneratingHistory getFailedHistory(final TestGenerationActivity activity,
                                                 final GenerationFailReason failReason) {
    return TestGeneratingHistory.builder()
       .startDate(activity.getStartDate())
       .endDate(LocalDateTime.now())
       .cid(activity.getCid())
       .failReason(failReason.name())
       .fileName(activity.getFileName())
       .status(ActivityStatus.FAILED)
       .userId(activity.getUserId())
       .requestDto(activity.getRequestDto())
       .build();
  }

  default TestGeneratingHistory getFailedHistoryWhenNoActivity(final GenerateTestRequestDto dto, final Long userId,
                                                               final GenerationFailReason failReason, final String cid,
                                                               final String fileName) {
    return TestGeneratingHistory.builder()
          .endDate(LocalDateTime.now())
          .cid(cid)
          .failReason(failReason.name())
          .requestDto(dto)
          .status(ActivityStatus.FAILED)
          .fileName(fileName)
          .userId(userId)
          .build();
  }

}
