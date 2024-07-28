package com.example.aitestgenerator.repositories;

import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.enums.GenerationStatus;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestGeneratingHistoryRepository extends CrudRepository<TestGeneratingHistory, Long> {
    List<TestGeneratingHistory> findAllByUserIdOrderByIdDesc(final Long userId);

    List<TestGeneratingHistory> findAllByGenerationStatus(final GenerationStatus generationStatus);

    List<TestGeneratingHistory> findAllByUserIdAndGenerationStatus(final Long userId, final GenerationStatus generationStatus);

}
