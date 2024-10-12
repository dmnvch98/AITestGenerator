package com.example.aitestgenerator.repositories;

import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.enums.ActivityStatus;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestGeneratingHistoryRepository extends CrudRepository<TestGeneratingHistory, Long> {
    List<TestGeneratingHistory> findAllByUserIdOrderByIdDesc(final Long userId);

    List<TestGeneratingHistory> findAllByUserIdAndStatus(final Long userId, final ActivityStatus status);

    List<TestGeneratingHistory> findAllByUserIdAndStatusIn(final Long userId, final List<ActivityStatus> statuses);
}
