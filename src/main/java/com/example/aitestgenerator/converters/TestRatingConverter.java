package com.example.aitestgenerator.converters;

import com.example.aitestgenerator.dto.tests.TestRatingDto;
import com.example.aitestgenerator.models.TestRating;
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
