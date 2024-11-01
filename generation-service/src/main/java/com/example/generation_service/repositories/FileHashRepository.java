package com.example.generation_service.repositories;

import java.util.List;
import java.util.Optional;


import com.example.generation_service.models.FileHash;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileHashRepository extends CrudRepository<FileHash, Long> {

    FileHash findByHashedFilenameAndUserId(final String hashedFilename, final Long userId);

    Boolean existsByOriginalFilenameAndUserId(final String originalFileName, final Long userId);

    List<FileHash> findAllByUserId(final long userId, Sort sort);

    void deleteAllByHashedFilenameAndUserId(final String hashedFileName, final long userId);

    Optional<FileHash> getFileHashesByHashedFilenameAndUserId(final String hashedFileName, final long userId);

}
