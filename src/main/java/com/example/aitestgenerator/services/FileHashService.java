package com.example.aitestgenerator.services;

import java.util.List;


import com.example.aitestgenerator.models.FileHash;
import com.example.aitestgenerator.repositories.FileHashRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FileHashService {

  private static final Logger log = LoggerFactory.getLogger(FileHashService.class);
  private final FileHashRepository repository;

  public void save(final FileHash fileHash) {
    repository.save(fileHash);
  }

  public void delete(final long id, final String hashedFileName) {
    repository.deleteAllByHashedFilenameAndUserId(hashedFileName, id);
    log.info("[{}/{}] deleted from repository", id, hashedFileName);
  }

  public List<FileHash> getAllByUserId(final long userId) {
    return repository.findAllByUserId(userId);
  }

  public boolean isExistsByHashedFilenameAndUser(final Long userId, final String hashedFileName) {
    return repository.existsByHashedFilenameAndUserId(hashedFileName, userId);
  }

  public FileHash getByHashedFilenameAndUserId(final Long userId, final String hashedFileName) {
    return repository.findByHashedFilenameAndUserId(hashedFileName, userId);
  }

}
