package com.example.aitestgenerator.services;

import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.enums.ActivityStatus;
import com.example.aitestgenerator.repositories.TestGeneratingHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TestGeneratingHistoryService {

    private final TestGeneratingHistoryRepository repository;

    public void save(final TestGeneratingHistory history) {
        repository.save(history);
    }

    public void save(final List<TestGeneratingHistory> histories) {
        repository.saveAll(histories);
    }

    public List<TestGeneratingHistory> getAllByUserId(final Long userId) {
        return repository.findAllByUserIdOrderByIdDesc(userId);
    }

    public List<TestGeneratingHistory> findAllByGenerationStatus(final long userId, final ActivityStatus status) {
        return repository.findAllByUserIdAndStatus(userId, status);
    }

    public List<TestGeneratingHistory> findAllByUserIdAndGenerationStatusIn(final long userId, final List<ActivityStatus> statuses) {
        return repository.findAllByUserIdAndStatusIn(userId, statuses);
    }


}
