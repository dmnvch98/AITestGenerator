package com.example.aitestgenerator.repositories;

import java.util.List;


import com.example.aitestgenerator.models.FileHash;
import com.example.aitestgenerator.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileHashRepository extends CrudRepository<FileHash, Long> {
    FileHash findByHashedFilename(final String hashedFilename);

    Boolean existsByHashedFilenameAndUserId(final String hashedFileName, final Long userId);

    List<FileHash> findAllByUserId(final long userId);

    void deleteAllByHashedFilenameAndUserId(final String hashedFileName, final long userId);

}
