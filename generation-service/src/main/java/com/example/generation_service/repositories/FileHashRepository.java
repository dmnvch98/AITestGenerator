package com.example.generation_service.repositories;

import java.util.List;


import com.example.generation_service.models.FileHash;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileHashRepository extends CrudRepository<FileHash, Long> {

    FileHash findByHashedFilenameAndUserId(final String hashedFilename, final Long userId);

    Boolean existsByHashedFilenameAndUserId(final String hashedFileName, final Long userId);

    List<FileHash> findAllByUserId(final long userId);

    void deleteAllByHashedFilenameAndUserId(final String hashedFileName, final long userId);

}
