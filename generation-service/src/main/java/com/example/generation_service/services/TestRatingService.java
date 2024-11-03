package com.example.generation_service.services;

import com.example.generation_service.converters.TestRatingConverter;
import com.example.generation_service.exceptions.ResourceNotFoundException;
import com.example.generation_service.models.test.TestRating;
import com.example.generation_service.repositories.test.TestRatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TestRatingService {

  private final TestRatingRepository repository;
  private final TestRatingConverter converter;

  public TestRating upsert(final TestRating rating) {
    final TestRating testRatingToSave = repository.findByTestIdAndUserId(rating.getTestId(), rating.getUserId())
          .map(existingRating -> converter.updateFields(existingRating, rating))
          .orElse(rating);
    return repository.save(testRatingToSave);
  }

  public TestRating findByTestIdAndUserId(final Long testId, final Long userId) {
    return repository.findByTestIdAndUserId(testId, userId)
          .orElseThrow(() -> new ResourceNotFoundException("Rating for  testId=[" + testId + "] was not found " +
                "for userId=[" + userId + "]"));
  }
}
