package com.example.aitestgenerator.repositories;

import com.example.aitestgenerator.models.TestRating;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface TestRatingRepository extends CrudRepository<TestRating, Long> {

  Optional<TestRating> findByTestIdAndUserId(final Long testId, final Long userId);
}
