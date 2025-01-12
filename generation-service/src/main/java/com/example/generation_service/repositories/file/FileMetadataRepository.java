package com.example.generation_service.repositories.file;

import java.util.List;
import java.util.Optional;


import com.example.generation_service.models.files.FileMetadata;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileMetadataRepository extends CrudRepository<FileMetadata, Long>, JpaSpecificationExecutor<FileMetadata> {

    FileMetadata findByHashedFilenameAndUserId(final String hashedFilename, final Long userId);

    FileMetadata findByOriginalFilenameAndUserId(final String originalFilename, final Long userId);

    Boolean existsByOriginalFilenameAndUserId(final String originalFileName, final Long userId);

    List<FileMetadata> findAllByUserId(final long userId, Sort sort);

    void deleteAllByHashedFilenameAndUserId(final String hashedFileName, final long userId);

    Optional<FileMetadata> getFileHashesByHashedFilenameAndUserId(final String hashedFileName, final long userId);

}
