package com.example.aitestgenerator.services;

import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.repositories.TestGeneratingHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class TestGeneratingHistoryService {
    private final TestGeneratingHistoryRepository repository;

    public void save(TestGeneratingHistory history) {
        repository.save(history);
    }

    public List<TestGeneratingHistory> getAllByUserId(Long userId) {
        return repository.findAllByUserId(userId);
    }
}
