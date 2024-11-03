package com.example.generation_service.services;

import java.util.List;


import com.example.generation_service.exceptions.ResourceNotFoundException;
import com.example.generation_service.models.files.FileHash;
import com.example.generation_service.models.files.FileSearchVector;
import com.example.generation_service.repositories.file.FileHashRepository;
import com.example.generation_service.repositories.file.FileSearchVectorRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FileHashService {

  private static final Logger log = LoggerFactory.getLogger(FileHashService.class);
  private final FileHashRepository repository;
  private final FileSearchVectorRepository vectorRepository;

  public void save(final FileHash fileHash) {
    repository.save(fileHash);
    vectorRepository.insertSearchVector(fileHash.getId(), fileHash.getOriginalFilename(), "russian");
  }

  public void delete(final long id, final String hashedFileName) {
    repository.deleteAllByHashedFilenameAndUserId(hashedFileName, id);
    log.info("[{}/{}] deleted from repository", id, hashedFileName);
  }

  public List<FileHash> getAllByUserId(final long userId) {
    return repository.findAllByUserId(userId, Sort.by("uploadTime").descending());
  }

  public Page<FileHash> getUserFileHashes(final Long userId, final String search, final int page, final int size,
                                          final String sortBy, final String sortDirection) {
    try {
      final Sort.Direction direction = Sort.Direction.fromString(sortDirection);
      final Pageable pageable = PageRequest.of(page, size, direction, sortBy);
      final Specification<FileHash> spec = Specification.where((root, query, criteriaBuilder) -> {
        final Predicate userIdPredicate = criteriaBuilder.equal(root.get("userId"), userId);

        if (search == null || search.trim().isEmpty()) {
          return userIdPredicate;
        }
        final Join<FileHash, FileSearchVector> searchVectorJoin = root.join("fileSearchVectors");
        final String formattedSearch = search.trim().replaceAll("\\s+", " | ");
        final Predicate ftsPredicate = criteriaBuilder.equal(
                criteriaBuilder.function("fts_search", Boolean.class,
                        searchVectorJoin.get("searchVector"),
                        criteriaBuilder.literal("russian"),
                        criteriaBuilder.concat(criteriaBuilder.literal(formattedSearch), criteriaBuilder.literal(":*"))
                ), true
        );

        return criteriaBuilder.and(userIdPredicate, ftsPredicate);
      });

      return repository.findAll(spec, pageable);
    } catch (final Exception e) {
      log.error("Cannot get user file hashes", e);
      throw new IllegalArgumentException("Cannot get user file hashes");
    }
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
