package com.example.generation_service.repositories.file;

import com.example.generation_service.models.files.FileSearchVector;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

public interface FileSearchVectorRepository extends CrudRepository<FileSearchVector, Long> {

    @Transactional
    @Modifying
    @Query(value = """
            INSERT INTO file_search_vectors (file_metadata_id, search_vector, language)
            VALUES (:fileHashId, to_tsvector(COALESCE(NULLIF(:fileName, ''), '')), :language)
            """,
            nativeQuery = true)
    void insertSearchVector(final Long fileHashId, final String fileName,  final String language);
}
