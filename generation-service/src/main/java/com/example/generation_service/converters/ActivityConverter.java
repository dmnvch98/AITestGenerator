package com.example.generation_service.converters;

import com.example.generation_service.dto.activity.TestGenerationActivityResponseDto;
import com.example.generation_service.dto.activity.TestGenerationActivityRequestDto;
import com.example.generation_service.exceptionHandler.enumaration.GenerationFailReason;
import com.example.generation_service.models.activity.TestGenerationActivity;
import com.example.generation_service.dto.tests.GenerateTestRequestDto;
import com.example.generation_service.models.enums.ActivityStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper
public interface ActivityConverter {

  default TestGenerationActivity getWaitingActivity(final String cid, final GenerateTestRequestDto requestDto,
                                                    final String fileName, final Long userId) {
    return TestGenerationActivity
       .builder()
       .status(ActivityStatus.WAITING)
       .fileName(fileName)
       .requestDto(requestDto)
       .userId(userId)
       .cid(cid)
       .build();
  }

  default TestGenerationActivity getInProgressActivity(final TestGenerationActivity activity, final String messageReceipt) {
    return TestGenerationActivity.builder()
       .id(activity.getId())
       .status(ActivityStatus.IN_PROCESS)
       .cid(activity.getCid())
       .fileName(activity.getFileName())
       .requestDto(activity.getRequestDto())
       .userId(activity.getUserId())
       .messageReceipt(messageReceipt)
       .startDate(activity.getStartDate())
       .build();
  }

  default TestGenerationActivity getFinishedActivity(final TestGenerationActivity activity, final Long testId,
                                                     final String testTitle) {
    return TestGenerationActivity.builder()
          .id(activity.getId())
          .status(ActivityStatus.SUCCESS)
          .cid(activity.getCid())
          .startDate(activity.getStartDate())
          .endDate(LocalDateTime.now())
          .fileName(activity.getFileName())
          .requestDto(activity.getRequestDto())
          .userId(activity.getUserId())
          .cid(activity.getCid())
          .messageReceipt(activity.getMessageReceipt())
          .testId(testId)
          .testTitle(testTitle)
          .build();
  }

  default TestGenerationActivity getFailedActivity(final TestGenerationActivity activity,
                                                   final GenerationFailReason failReason) {
    return TestGenerationActivity.builder()
          .id(activity.getId())
          .status(ActivityStatus.FAILED)
          .startDate(activity.getStartDate())
          .endDate(LocalDateTime.now())
          .fileName(activity.getFileName())
          .cid(activity.getCid())
          .failReason(failReason)
          .userId(activity.getUserId())
          .build();
  }

  default TestGenerationActivity getFailedWaitingActivity(final String cid, final String fileName,
                                                   final GenerationFailReason failReason) {
    return TestGenerationActivity.builder()
          .status(ActivityStatus.FAILED)
          .endDate(LocalDateTime.now())
          .fileName(fileName)
          .cid(cid)
          .failReason(failReason)
          .build();
  }

  default Set<TestGenerationActivityResponseDto> convert(final Set<TestGenerationActivity> activities) {
    return activities
          .stream()
          .map(this::convert)
          .collect(Collectors.toSet());
  }

  @Mapping(source = "failReason", target = "failCode", qualifiedByName = "convertFailReason")
  TestGenerationActivityResponseDto convert(final TestGenerationActivity activity);

  @Mapping(source = "userId", target = "userId")
  TestGenerationActivity convert(final TestGenerationActivityRequestDto dto, final Long userId);

  @Named("convertFailReason")
  default Integer convertFailReason(final GenerationFailReason failReason) {
    return Optional.ofNullable(failReason)
          .map(GenerationFailReason::getFailCode)
          .orElse(null);
  }

}
