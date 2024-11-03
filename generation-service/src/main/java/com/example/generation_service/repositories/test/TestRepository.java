package com.example.generation_service.repositories.test;

import com.example.generation_service.models.test.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface TestRepository extends CrudRepository<Test, Long>, JpaSpecificationExecutor<Test> {

    List<Test> findAllByUserId(final Long userId, final Sort sort);

    Optional<Test> findTestByIdAndUserId(Long id, Long userId);

    List<Test> findAllByIdInAndUserId(final List<Long> ids, final Long userId, final Sort sort);

    @Transactional
    void deleteTestById(Long id);

    @Query(value = "SELECT t.*" +
            "FROM tests t " +
            "LEFT JOIN test_search_vectors v ON t.id = v.test_id " +
            "WHERE t.user_id = :userId " +
            "AND v.search_vector @@ to_tsquery('russian', :search) ",
            nativeQuery = true)
    Page<Test> findTestsWithSearch(@Param("search") String search, @Param("userId") Long userId, Pageable pageable);
}
