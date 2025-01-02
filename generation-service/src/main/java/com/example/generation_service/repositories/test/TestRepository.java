package com.example.generation_service.repositories.test;

import com.example.generation_service.models.test.Test;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface TestRepository extends CrudRepository<Test, Long>, JpaSpecificationExecutor<Test> {

    Optional<Test> findTestByIdAndUserId(Long id, Long userId);

    @Transactional
    void deleteTestById(Long id);

}
