package com.example.generation_service.services;

import com.amazonaws.services.s3.model.S3Object;
import com.example.generation_service.extractors.FileExtractorFabric;
import com.example.generation_service.models.files.FileMetadata;
import com.example.generation_service.services.aws.StorageClient;
import com.example.generation_service.utils.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileExtractorService {

  private final StorageClient storageClient;
  private final FileExtractorFabric fileExtractorFabric;

  public String getContentFromFile(final FileMetadata fileHash, final Long userId) throws IOException {
    final String fileExtension = Utils.getFileExtension(fileHash.getOriginalFilename());
    final S3Object s3Object = storageClient.downloadFile(userId, fileHash.getHashedFilename());
    final Resource resource = new InputStreamResource(s3Object.getObjectContent());
    return fileExtractorFabric.getFileExtractor(fileExtension)
          .extract(resource.getInputStream());
  }

  public String getContentFromFile(final MultipartFile file) throws IOException {
    final String fileExtension = Utils.getFileExtension(file.getOriginalFilename());
    return fileExtractorFabric.getFileExtractor(fileExtension)
          .extract(file.getInputStream());
  }
}
