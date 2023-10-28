package com.example.aitestgenerator.services;

import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.repositories.TestGeneratingHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TestGeneratingHistoryService {
    private final TestGeneratingHistoryRepository repository;

    public void save(TestGeneratingHistory history) {
        repository.save(history);
    }
}
