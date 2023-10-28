package com.example.aitestgenerator.repositories;

import com.example.aitestgenerator.models.TestGeneratingHistory;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestGeneratingHistoryRepository extends CrudRepository<TestGeneratingHistory, Long> {
}
