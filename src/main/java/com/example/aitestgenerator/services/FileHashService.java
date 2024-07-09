package com.example.aitestgenerator.services;

import java.util.List;


import com.amazonaws.services.sqs.model.ResourceNotFoundException;
import com.example.aitestgenerator.models.FileHash;
import com.example.aitestgenerator.models.User;
import com.example.aitestgenerator.repositories.FileHashRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FileHashService {

  private final FileHashRepository repository;

  public void save(final FileHash fileHash) {
    repository.save(fileHash);
  }

  public void delete(final long id, final String hashedFileName) {
    repository.deleteAllByHashedFilenameAndUserId(hashedFileName, id);
  }

  public List<FileHash> getAllByUserId(final long userId) {
    return repository.findAllByUserId(userId);
  }

  public boolean isExistsByHashedFilenameAndUser(final String hashedFileName, final Long userId) {
    return repository.existsByHashedFilenameAndUserId(hashedFileName, userId);
  }

}
