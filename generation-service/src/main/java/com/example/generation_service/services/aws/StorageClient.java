package com.example.generation_service.services.aws;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.amazonaws.services.s3.model.S3Object;

import java.io.InputStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class StorageClient {

  private final AmazonS3 amazonS3;

  @Value("${aws.s3-bucket}")
  private String bucketName;

  public void uploadFile(final long userId, final String fileHash, final String fileName, final InputStream inputStream,
                         final ObjectMetadata metadata) {
    final String key = generateFileKey(userId, fileHash);
    amazonS3.putObject(bucketName, key, inputStream, metadata);
    log.info("Uploaded file [{}] to storage path [{}]", fileName, key);
  }

  public S3Object downloadFile(final long userId, final String fileHash) {
    final String key = generateFileKey(userId, fileHash);
    try {
      return amazonS3.getObject(bucketName, key);
    } catch (final Exception e) {
      log.error("Error when downloading file [{}] from storage", fileHash, e);
      return null;
    }
  }

  public void deleteFile(final long userId, final String fileHash) {
    final String key = generateFileKey(userId, fileHash);
    try {
      amazonS3.deleteObject(bucketName, key);
      log.info("Deleted file [{}] from storage", key);
    } catch (final Exception e) {
      log.error("Error when deleting file [{}] from storage", key, e);
    }
  }

  public boolean doesFileExist(final long userId, final String fileHash) {
    final String key = generateFileKey(userId, fileHash);
    try {
      return amazonS3.doesObjectExist(bucketName, key);
    } catch (final Exception e) {
      log.error("Error when checking existence of file [{}] in storage", key, e);
      return false;
    }
  }

  private String generateFileKey(final long userId, final String fileName) {
    return userId + "/" + fileName;
  }
}
