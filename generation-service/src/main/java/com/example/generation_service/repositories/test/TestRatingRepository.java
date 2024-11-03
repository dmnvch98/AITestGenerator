package com.example.generation_service.repositories.test;

import com.example.generation_service.models.test.TestRating;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface TestRatingRepository extends CrudRepository<TestRating, Long> {

  Optional<TestRating> findByTestIdAndUserId(final Long testId, final Long userId);
}
