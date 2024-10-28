package com.example.generation_service.facades;

import java.io.IOException;
import java.util.List;


import com.amazonaws.services.s3.model.ObjectMetadata;
import com.example.generation_service.converters.FileHashConverter;
import com.example.generation_service.dto.texts.FileHashesResponseDto;
import com.example.generation_service.exceptions.*;
import com.example.generation_service.models.FileHash;
import com.example.generation_service.models.enums.UploadStatus;
import com.example.generation_service.services.FileHashService;
import com.example.generation_service.services.aws.StorageClient;
import com.example.generation_service.validators.file.FileValidator;
import com.example.generation_service.validators.file.dto.FileValidationDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
@RequiredArgsConstructor
@Slf4j
public class FileFacade {

  private final FileHashService fileHashService;
  private final StorageClient storageClient;
  private final FileHashConverter converter;
  private final List<FileValidator> fileValidators;

  @Transactional
  public UploadStatus saveFile(final long userId, final MultipartFile file) {
    final FileValidationDto validationDto = validateFile(file);

    if (!validationDto.getUploadStatus().equals(UploadStatus.SUCCESS)) {
      return validationDto.getUploadStatus();
    }

    try {
      final String originalFileName = file.getOriginalFilename();
      final ObjectMetadata metadata = new ObjectMetadata();
      metadata.setContentLength(file.getSize());

      final String fileNameHash = DigestUtils.md5Hex(originalFileName);

      storageClient.uploadFile(userId, fileNameHash, file.getInputStream(), metadata);

      final FileHash fileHash = converter.convertToFileHash(fileNameHash, originalFileName, userId,
              validationDto.getFileData());

      fileHashService.save(fileHash);
    } catch (IOException e) {
      log.error("Error when saving file: {} for user id: {}", file.getOriginalFilename(), userId, e);
      return UploadStatus.FAILED;
    }
    return UploadStatus.SUCCESS;
  }

  public Resource getFileByHash(final long userId, final String hash) {
    if (checkFileEligibility(userId, hash)) {
      return storageClient.downloadFile(userId, hash);
    } else {
      log.warn("Exception when accessing a file.  File name: {} , user id: {}. ", hash, userId);
      return null;
    }
  }

  @Transactional
  public void deleteFileByHash(final long userId, final String hash) {
    if (checkFileEligibility(userId, hash)) {
      storageClient.deleteFile(userId, hash);
    } else {
      log.warn("Exception when deleting a file. File not found. File name: {} , user id: {}. ", hash, userId);
    }
    fileHashService.delete(userId, hash);
  }

  public FileHashesResponseDto getAllUserFileDescriptions(final long userId) {
    return converter.convert(fileHashService.getAllByUserId(userId));
  }

  private boolean checkFileEligibility(final long userId, final String hashedFileName) {
    final boolean isExists = fileHashService.isExistsByHashedFilenameAndUser(userId, hashedFileName);
    if (!isExists) {
      throw new ResourceNotFoundException(hashedFileName);
    }
    return true;
  }

  private FileValidationDto validateFile(final MultipartFile file) {
    final FileValidationDto dto = converter.convertToValidateDto(file);
    for (final FileValidator validator : fileValidators) {
        final UploadStatus validationStatus = validator.validate(dto).getUploadStatus();
        if (validationStatus != UploadStatus.SUCCESS) {
            return dto;
        }
    }
    return dto;
  }
}
