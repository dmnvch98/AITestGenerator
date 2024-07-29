package com.example.aitestgenerator.services;

import com.example.aitestgenerator.converters.TestGenerationHistoryConverter;
import com.example.aitestgenerator.dto.tests.TextGenerationHistoryDto;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.enums.GenerationStatus;
import com.example.aitestgenerator.repositories.TestGeneratingHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TestGeneratingHistoryService {

    private final TestGeneratingHistoryRepository repository;
    private final SimpMessagingTemplate messagingTemplate;
    private final TestGenerationHistoryConverter testGenerationHistoryConverter;

    public void save(final TestGeneratingHistory history) {
        repository.save(history);
        final TextGenerationHistoryDto dto = testGenerationHistoryConverter.historyToDto(history);
        messagingTemplate.convertAndSendToUser("1", "/queue/TestGeneratingHistory", dto);
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

    public List<TestGeneratingHistory> findAllByGenerationStatus(final long userId, final GenerationStatus status) {
        return repository.findAllByUserIdAndGenerationStatus(userId, status);
    }

    public List<TestGeneratingHistory> findAllByUserIdAndGenerationStatusIn(final long userId, final List<GenerationStatus> statuses) {
        return repository.findAllByUserIdAndGenerationStatusIn(userId, statuses);
    }


}
