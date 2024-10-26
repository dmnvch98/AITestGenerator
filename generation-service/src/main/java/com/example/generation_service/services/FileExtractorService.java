package com.example.generation_service.services;

import com.example.generation_service.extractors.FileExtractorFabric;
import com.example.generation_service.models.FileHash;
import com.example.generation_service.services.aws.StorageClient;
import com.example.generation_service.utils.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileExtractorService {

  private final StorageClient storageClient;
  private final FileExtractorFabric fileExtractorFabric;

  public String getContentFromFile(final FileHash fileHash, final Long userId) {
    final String fileExtension = Utils.getFileExtension(fileHash.getOriginalFilename());
    final URL fileUrl = storageClient.getFileUrl(userId, fileHash.getHashedFilename());
    return fileExtractorFabric.getFileExtractor(fileExtension)
          .extract(fileUrl);
  }

  public String getContentFromFile(final MultipartFile file) throws IOException {
    final String fileExtension = Utils.getFileExtension(file.getOriginalFilename());
    return fileExtractorFabric.getFileExtractor(fileExtension)
          .extract(file.getInputStream());
  }
}