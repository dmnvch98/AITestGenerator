package com.example.aitestgenerator.repositories;

import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestGeneratingHistoryRepository extends CrudRepository<TestGeneratingHistory, Long> {
    List<TestGeneratingHistory> findAllByUserId(final Long userId);

}
