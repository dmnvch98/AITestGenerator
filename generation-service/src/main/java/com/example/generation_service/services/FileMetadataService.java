package com.example.generation_service.services;

import java.util.List;


import com.example.generation_service.exceptions.ResourceNotFoundException;
import com.example.generation_service.models.files.FileMetadata;
import com.example.generation_service.models.files.FileSearchVector;
import com.example.generation_service.repositories.file.FileMetadataRepository;
import com.example.generation_service.repositories.file.FileSearchVectorRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileMetadataService {

  private final FileMetadataRepository repository;
  private final FileSearchVectorRepository vectorRepository;

  public FileMetadata save(final FileMetadata fileHash) {
    repository.save(fileHash);
    vectorRepository.insertSearchVector(fileHash.getId(), fileHash.getOriginalFilename(), "russian");
    return fileHash;
  }

  public void delete(final long userId, final String hashedFileName) {
    repository.deleteAllByHashedFilenameAndUserId(hashedFileName, userId);
    log.info("[{}/{}] deleted from repository", userId, hashedFileName);
  }

  public List<FileMetadata> getAllByUserId(final long userId) {
    return repository.findAllByUserId(userId, Sort.by("uploadTime").descending());
  }

  public Page<FileMetadata> getUserFileMetadataBySearchParams(final Long userId, final String search, final int page, final int size,
                                                              final String sortBy, final String sortDirection) {
    try {
      final Sort.Direction direction = Sort.Direction.fromString(sortDirection);
      final Pageable pageable = PageRequest.of(page, size, direction, sortBy);
      final Specification<FileMetadata> spec = Specification.where((root, query, criteriaBuilder) -> {
        final Predicate userIdPredicate = criteriaBuilder.equal(root.get("userId"), userId);

        if (search == null || search.trim().isEmpty()) {
          return userIdPredicate;
        }
        final Join<FileMetadata, FileSearchVector> searchVectorJoin = root.join("fileSearchVectors");
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

  public Page<FileMetadata> getUserFileMetadataByOriginalFilename(final Long userId, final String search, final int page, final int size,
                                                                  final String sortBy, final String sortDirection) {
    final Sort.Direction direction = Sort.Direction.fromString(sortDirection);
    final Pageable pageable = PageRequest.of(page, size, direction, sortBy);
    Specification<FileMetadata> spec = (root, query, criteriaBuilder) -> {
      Predicate userIdPredicate = criteriaBuilder.equal(root.get("userId"), userId);
      Predicate fileNamePredicate = criteriaBuilder.like(
              criteriaBuilder.lower(root.get("originalFilename")),
              "%" + search.trim().toLowerCase() + "%"
      );
      return criteriaBuilder.and(userIdPredicate, fileNamePredicate);
    };
    return repository.findAll(spec, pageable);
  }

  public void isExistsByHashedFilenameAndUserOrThrow(final Long userId, final String hashedFileName) {
    repository.getFileHashesByHashedFilenameAndUserId(hashedFileName, userId)
            .orElseThrow(() -> new ResourceNotFoundException(hashedFileName));
  }

  public boolean isExistsByOriginalFilenameAndUserId(final Long userId, final String hashedFileName) {
    return repository.existsByOriginalFilenameAndUserId(hashedFileName, userId);
  }

  public FileMetadata getByHashedFilenameAndUserId(final Long userId, final String hashedFileName) {
    return repository.findByHashedFilenameAndUserId(hashedFileName, userId);
  }

  public FileMetadata getByOriginalFilenameAndUserId(final Long userId, final String originalFilename) {
    return repository.findByOriginalFilenameAndUserId(originalFilename, userId);
  }

  public void delete(final FileMetadata fileHash) {
    repository.delete(fileHash);
  }

}
