package com.example.aitestgenerator.services;

import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.enums.GenerationStatus;
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

    public TestGeneratingHistory findById(final long id) {
        return repository.findById(id).orElse(null);
    }

    public List<TestGeneratingHistory> findAllByStatus(final GenerationStatus status) {
        return repository.findAllByGenerationStatus(status);
    }
}
