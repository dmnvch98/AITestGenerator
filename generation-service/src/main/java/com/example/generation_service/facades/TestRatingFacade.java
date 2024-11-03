package com.example.generation_service.facades;

import com.example.generation_service.converters.TestRatingConverter;
import com.example.generation_service.dto.tests.TestRatingDto;
import com.example.generation_service.models.test.TestRating;
import com.example.generation_service.services.TestRatingService;
import com.example.generation_service.services.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TestRatingFacade {

  private final TestRatingService service;
  private final TestRatingConverter converter;
  private final TestService testService;

  public TestRatingDto saveRating(final TestRatingDto requestDto, final Long testId, final Long userId) {
    testService.findAllByIdAndUserIdOrThrow(testId, userId);

    final TestRating testRating = converter.convert(requestDto, testId, userId);
    return converter.convert(service.upsert(testRating));
  }


  public TestRatingDto getRating(final Long testId, final Long userId) {
    return converter.convert(service.findByTestIdAndUserId(testId, userId));
  }
}
