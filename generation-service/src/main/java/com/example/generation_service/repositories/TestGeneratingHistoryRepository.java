package com.example.generation_service.repositories;

import com.example.generation_service.models.TestGeneratingHistory;
import com.example.generation_service.models.enums.ActivityStatus;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestGeneratingHistoryRepository extends CrudRepository<TestGeneratingHistory, Long>, JpaSpecificationExecutor<TestGeneratingHistory> {

    List<TestGeneratingHistory> findAllByUserIdOrderByIdDesc(final Long userId);

    List<TestGeneratingHistory> findAllByUserIdAndStatus(final Long userId, final ActivityStatus status);

    List<TestGeneratingHistory> findAllByUserIdAndStatusIn(final Long userId, final List<ActivityStatus> statuses);
}
