package com.example.generation_service.repositories.test;

import com.example.generation_service.models.test.TestGeneratingHistory;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestGeneratingHistoryRepository extends CrudRepository<TestGeneratingHistory, Long>,
        JpaSpecificationExecutor<TestGeneratingHistory> { }
