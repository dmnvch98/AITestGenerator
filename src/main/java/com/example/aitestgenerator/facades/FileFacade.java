package com.example.aitestgenerator.facades;

import java.io.IOException;
import java.time.LocalDateTime;


import com.amazonaws.services.s3.model.ObjectMetadata;
import com.example.aitestgenerator.converters.FileHashConverter;
import com.example.aitestgenerator.dto.texts.FileHashesResponseDto;
import com.example.aitestgenerator.exceptions.*;
import com.example.aitestgenerator.models.FileHash;
import com.example.aitestgenerator.models.User;
import com.example.aitestgenerator.services.FileHashService;
import com.example.aitestgenerator.services.UserService;
import com.example.aitestgenerator.services.aws.StorageClient;
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
  private final UserService userService;
  private final FileHashConverter converter;

  @Transactional
  public void saveFile(final long userId, final MultipartFile file) {
    final String originalFileName = file.getOriginalFilename();
    final ObjectMetadata metadata = new ObjectMetadata();
    final String fileNameHash = DigestUtils.md5Hex(originalFileName);
    metadata.setContentLength(file.getSize());

    if (fileHashService.isExistsByHashedFilenameAndUser(fileNameHash, userId)) {
      throw new ResourceAlreadyExistsException(originalFileName, userId);
    }

    try {
      storageClient.uploadFile(userId, fileNameHash, file.getInputStream(), metadata);
    } catch (IOException e) {
      log.error("Cannot get input stream from file", e);
    }

    final User user = userService.findUserById(userId);

    final FileHash fileHash = FileHash.builder()
        .hashedFilename(fileNameHash)
        .originalFilename(originalFileName)
        .uploadTime(LocalDateTime.now())
        .user(user)
        .build();

    fileHashService.save(fileHash);
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
    final boolean isExists = fileHashService.isExistsByHashedFilenameAndUser(hashedFileName, userId);
    if (!isExists) {
      throw new ResourceNotFoundException(hashedFileName, userId);
    }
    return true;
  }
}
