package com.example.aitestgenerator.services;

import com.example.aitestgenerator.converters.TestRatingConverter;
import com.example.aitestgenerator.exceptions.ResourceNotFoundException;
import com.example.aitestgenerator.models.TestRating;
import com.example.aitestgenerator.repositories.TestRatingRepository;
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
