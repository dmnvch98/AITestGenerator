package com.example.generation_service.repositories.test;

import com.example.generation_service.models.test.TestSearchVector;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface TestSearchVectorRepository extends CrudRepository<TestSearchVector, Long> {

    @Transactional
    @Modifying
    @Query(value = """
            INSERT INTO test_search_vectors (test_id, search_vector, language)
                        VALUES (:testId, to_tsvector(COALESCE(NULLIF(:fileName, ''), '') || ' ' || COALESCE(NULLIF(:title, ''), '')), :language)
            """,
            nativeQuery = true)
    void insertSearchVector(final Long testId, final String fileName, final String title, final String language);
}