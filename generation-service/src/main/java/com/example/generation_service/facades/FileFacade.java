package com.example.generation_service.facades;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


import com.amazonaws.services.s3.model.ObjectMetadata;
import com.example.generation_service.converters.FileHashConverter;
import com.example.generation_service.dto.texts.FileHashesResponseDto;
import com.example.generation_service.exceptions.*;
import com.example.generation_service.models.FileHash;
import com.example.generation_service.models.enums.UploadStatus;
import com.example.generation_service.services.FileExtractorService;
import com.example.generation_service.services.FileHashService;
import com.example.generation_service.services.aws.StorageClient;
import com.example.generation_service.utils.Utils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.poi.util.StringUtil;
import org.springframework.beans.factory.annotation.Value;
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
  private final FileExtractorService fileExtractorService;
  @Value("${file-upload.allowed-extensions}")
  private final List<String> allowedFileExtensions;
  private final static Integer MAX_TOKENS = 6500;

  @Transactional
  public UploadStatus saveFile(final long userId, final MultipartFile file) {
    final String originalFileName = file.getOriginalFilename();
    final ObjectMetadata metadata = new ObjectMetadata();
    final String fileNameHash = DigestUtils.md5Hex(originalFileName);
    metadata.setContentLength(file.getSize());

    if (!checkFileExtension(originalFileName)) {
      return UploadStatus.INVALID_EXTENSION;
    }

    if (fileHashService.isExistsByHashedFilenameAndUser(userId, fileNameHash)) {
      return UploadStatus.ALREADY_UPLOADED;
    }

    int tokensCount;
    try {
      final String fileContent = fileExtractorService.getContentFromFile(file);
      tokensCount = Utils.countTokens(fileContent);
      if (tokensCount > MAX_TOKENS) {
        return UploadStatus.TOO_LARGE;
      }
    } catch (final IOException e) {
      log.error("An error occurred when parsing user file. User id=[{}], fileName=[{}]", userId, originalFileName);
      return UploadStatus.FAILED;
    }

    try {
      storageClient.uploadFile(userId, fileNameHash, file.getInputStream(), metadata);
      final FileHash fileHash = FileHash.builder()
            .hashedFilename(fileNameHash)
            .originalFilename(originalFileName)
            .uploadTime(LocalDateTime.now())
            .userId(userId)
            .tokensCount(tokensCount)
            .build();

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

  private boolean checkFileExtension(final String fileName) {
    return Optional.ofNullable(fileName)
          .filter(StringUtil::isNotBlank)
          .map(f -> fileName.substring(f.lastIndexOf('.') + 1).toLowerCase())
          .map(allowedFileExtensions::contains)
          .orElse(false);
  }
}
