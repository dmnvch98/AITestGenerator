package com.example.generation_service.repositories;

import com.example.generation_service.models.Test;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface TestRepository extends CrudRepository<Test, Long> {
    List<Test> findAllByUserId(Long userId, Sort sort);

    Optional<Test> findTestByIdAndUserId(Long id, Long userId);

    List<Test> findAllByIdInAndUserId(final List<Long> ids, final Long userId, final Sort sort);

    @Transactional
    void deleteTestById(Long id);
}
