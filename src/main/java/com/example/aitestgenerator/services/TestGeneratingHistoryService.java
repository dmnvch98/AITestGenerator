package com.example.aitestgenerator.services;

import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.User;
import com.example.aitestgenerator.repositories.TestGeneratingHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class TestGeneratingHistoryService {

    private final TestGeneratingHistoryRepository repository;

    public void save(TestGeneratingHistory history) {
        repository.save(history);
    }

    public List<TestGeneratingHistory> getAllByUserId(final Long userId) {
        return repository.findAllByUserId(userId);
    }

    public TestGeneratingHistory findByIdAndUserId(final long id) {
        return repository.findById(id).orElse(null);
    }
}
