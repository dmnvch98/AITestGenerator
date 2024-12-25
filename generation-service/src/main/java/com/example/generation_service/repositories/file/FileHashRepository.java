package com.example.generation_service.repositories.file;

import java.util.List;
import java.util.Optional;


import com.example.generation_service.models.files.FileHash;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileHashRepository extends CrudRepository<FileHash, Long>, JpaSpecificationExecutor<FileHash> {

    FileHash findByHashedFilenameAndUserId(final String hashedFilename, final Long userId);

    FileHash findByOriginalFilenameAndUserId(final String originalFilename, final Long userId);

    void deleteByOriginalFilenameAndUserId(final String originalFilename, final Long userId);

    Boolean existsByOriginalFilenameAndUserId(final String originalFileName, final Long userId);

    List<FileHash> findAllByUserId(final long userId, Sort sort);

    void deleteAllByHashedFilenameAndUserId(final String hashedFileName, final long userId);

    Optional<FileHash> getFileHashesByHashedFilenameAndUserId(final String hashedFileName, final long userId);

}
