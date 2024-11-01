package com.example.generation_service.services;

import java.util.List;


import com.example.generation_service.exceptions.ResourceNotFoundException;
import com.example.generation_service.models.FileHash;
import com.example.generation_service.repositories.FileHashRepository;
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

  public void isExistsByHashedFilenameAndUserOrThrow(final Long userId, final String hashedFileName) {
    repository.getFileHashesByHashedFilenameAndUserId(hashedFileName, userId)
            .orElseThrow(() -> new ResourceNotFoundException(hashedFileName));
  }

  public boolean isExistsByOriginalFilenameAndUserId(final Long userId, final String hashedFileName) {
    return repository.existsByOriginalFilenameAndUserId(hashedFileName, userId);
  }

  public FileHash getByHashedFilenameAndUserId(final Long userId, final String hashedFileName) {
    return repository.findByHashedFilenameAndUserId(hashedFileName, userId);
  }

}
