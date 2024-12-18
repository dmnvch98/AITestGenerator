package com.example.generation_service.converters;

import com.example.generation_service.dto.tests.QuestionTypeQuantity;
import com.example.generation_service.dto.tests.TestGenHistoryResponseDto;
import com.example.generation_service.models.activity.TestGenerationActivity;
import com.example.generation_service.dto.tests.GenerateTestRequestDto;
import com.example.generation_service.dto.tests.TextGenerationHistoryDto;
import com.example.generation_service.exceptionHandler.enumaration.GenerationFailReason;
import com.example.generation_service.generators.models.GenerateTestRequestParams;
import com.example.generation_service.models.*;
import com.example.generation_service.models.enums.ActivityStatus;
import com.example.generation_service.models.files.FileHash;
import com.example.generation_service.models.test.Test;
import com.example.generation_service.models.test.TestGeneratingHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.data.domain.Page;

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
  @Mapping(source = "questionTypeQuantity.questionType", target = "questionType")
  @Mapping(source = "questionTypeQuantity.maxQuestions", target = "maxQuestions")
  GenerateTestRequestParams convert(final GenerateTestMessage message, final String text, final FileHash fileHash, final QuestionTypeQuantity questionTypeQuantity);

  @Named("convertFailReason")
  default Integer convertFailReason(final String failReason) {
    return Optional.ofNullable(failReason)
          .map(GenerationFailReason::getFailCode)
          .orElse(null);
  }

  default TestGeneratingHistory getSuccessHistory(final TestGenerationActivity activity, final Test test) {
    if (activity == null) {
      return TestGeneratingHistory.builder()
          .testId(test.getId())
          .testTitle(test.getTitle())
          .endDate(LocalDateTime.now())
          .fileName(test.getFileName())
          .userId(test.getUserId())
          .build();
    }
    return TestGeneratingHistory.builder()
       .testId(test.getId())
       .testTitle(test.getTitle())
       .startDate(activity.getStartDate())
       .endDate(LocalDateTime.now())
       .cid(activity.getCid())
       .fileName(activity.getFileName())
       .userId(test.getUserId())
       .status(ActivityStatus.SUCCESS)
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
       .build();
  }

  default TestGeneratingHistory getFailedHistoryWhenNoActivity(final GenerateTestRequestDto dto, final Long userId,
                                                               final GenerationFailReason failReason, final String cid,
                                                               final String fileName) {
    return TestGeneratingHistory.builder()
          .endDate(LocalDateTime.now())
          .cid(cid)
          .failReason(failReason.name())
          .status(ActivityStatus.FAILED)
          .fileName(fileName)
          .userId(userId)
          .build();
  }

  default TestGenHistoryResponseDto convert(final Page<TestGeneratingHistory> pageTest) {
    return TestGenHistoryResponseDto.builder()
            .history(pageTest.getContent().stream().map(this::historyToDto).toList())
            .totalPages(pageTest.getTotalPages())
            .totalElements(pageTest.getTotalElements())
            .build();
  }

}
