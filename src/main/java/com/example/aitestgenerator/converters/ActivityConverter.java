package com.example.aitestgenerator.converters;

import com.example.aitestgenerator.dto.activity.TestGenerationActivityDto;
import com.example.aitestgenerator.models.TestGenerationActivity;
import com.example.aitestgenerator.dto.tests.GenerateTestRequestDto;
import com.example.aitestgenerator.models.enums.ActivityStatus;
import org.mapstruct.Mapper;

import java.time.LocalDateTime;
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
       .uuid(activity.getUuid())
       .status(ActivityStatus.IN_PROCESS)
       .cid(activity.getCid())
       .startDate(LocalDateTime.now())
       .fileName(activity.getFileName())
       .requestDto(activity.getRequestDto())
       .userId(activity.getUserId())
       .messageReceipt(messageReceipt)
       .build();
  }

  default TestGenerationActivity getFinishedActivity(final TestGenerationActivity activity) {
    return TestGenerationActivity.builder()
          .uuid(activity.getUuid())
          .status(ActivityStatus.SUCCESS)
          .cid(activity.getCid())
          .startDate(activity.getStartDate())
          .endDate(LocalDateTime.now())
          .fileName(activity.getFileName())
          .requestDto(activity.getRequestDto())
          .userId(activity.getUserId())
          .messageReceipt(activity.getMessageReceipt())
          .build();
  }

  default TestGenerationActivityDto getFailedActivity(final TestGenerationActivity activity) {
    return TestGenerationActivityDto.builder()
          .uuid(activity.getUuid())
          .status(ActivityStatus.FAILED)
          .startDate(activity.getStartDate())
          .endDate(LocalDateTime.now())
          .fileName(activity.getFileName())
          .build();
  }

  default Set<TestGenerationActivityDto> convert(final Set<TestGenerationActivity> activities) {
    return activities
          .stream()
          .map(this::convert)
          .collect(Collectors.toSet());
  }

  TestGenerationActivityDto convert(final TestGenerationActivity activity);
}
