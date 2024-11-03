package com.example.generation_service.services;

import com.example.generation_service.models.test.TestGeneratingHistory;
import com.example.generation_service.models.enums.ActivityStatus;
import com.example.generation_service.repositories.test.TestGeneratingHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestGeneratingHistoryService {

    private final TestGeneratingHistoryRepository repository;

    public void save(final TestGeneratingHistory history) {
        repository.save(history);
    }

    public void save(final List<TestGeneratingHistory> histories) {
        repository.saveAll(histories);
    }

    public Page<TestGeneratingHistory> findUserHistory(final Long userId, final int page, final int size,
                                                       final String sortBy, final String sortDirection) {
        try {
            final Sort.Direction direction = Sort.Direction.fromString(sortDirection);
            final Pageable pageable = PageRequest.of(page, size, direction, sortBy);
            final Specification<TestGeneratingHistory> spec = Specification.where((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("userId"), userId));

            return repository.findAll(spec, pageable);
        } catch (final Exception e) {
            log.error("Cannot get user test history", e);
            throw new IllegalArgumentException("Cannot get user test history");
        }
    }
}
