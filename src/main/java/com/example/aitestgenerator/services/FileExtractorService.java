package com.example.aitestgenerator.services;

import com.example.aitestgenerator.extractors.FileExtractorFabric;
import com.example.aitestgenerator.models.FileHash;
import com.example.aitestgenerator.services.aws.StorageClient;
import com.example.aitestgenerator.utils.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URL;

@Service
@RequiredArgsConstructor
public class FileExtractorService {

  private final StorageClient storageClient;
  private final FileExtractorFabric fileExtractorFabric;

  public String getContentFromFile(final FileHash fileHash, final Long userId) {
    final String originalFileName = Utils.getFileExtension(fileHash.getOriginalFilename());
    final URL fileUrl = storageClient.getFileUrl(userId, fileHash.getHashedFilename());
    return fileExtractorFabric.getFileExtractor(originalFileName)
          .extract(fileUrl);
  }
}
