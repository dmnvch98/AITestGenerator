package com.example.aitestgenerator.repositories;

import com.example.aitestgenerator.models.Test;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface TestRepository extends CrudRepository<Test, Long> {
    List<Test> findAllByUserId(Long userId);

    Optional<Test> findTestByIdAndUserId(Long id, Long userId);

    List<Test> findAllByTextId(Long textId);

    List<Test> findAllByIdInAndUserId(List<Long> ids, Long userId);
}
