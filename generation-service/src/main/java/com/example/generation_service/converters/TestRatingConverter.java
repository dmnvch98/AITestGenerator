package com.example.generation_service.converters;

import com.example.generation_service.dto.tests.TestRatingDto;
import com.example.generation_service.models.TestRating;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface TestRatingConverter {

  @Mapping(source = "testId", target = "testId")
  @Mapping(source = "userId", target = "userId")
  TestRating convert(final TestRatingDto requestDto, final Long testId, final Long userId);

  TestRatingDto convert(final TestRating testRating);

  default TestRating updateFields(final TestRating existingRating, final TestRating newRating) {
    existingRating.setRating(newRating.getRating());
    existingRating.setFeedback(newRating.getFeedback());
    return existingRating;
  }
}
