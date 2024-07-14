package com.example.aitestgenerator.services.aws;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.example.aitestgenerator.models.FileHash;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;

import com.amazonaws.services.s3.model.S3Object;

import java.io.InputStream;
import java.net.URL;

@Service
@RequiredArgsConstructor
@Slf4j
public class StorageClient {

  private final AmazonS3 amazonS3;

  @Value("${aws.s3-bucket}")
  private String bucketName;

  public void uploadFile(final long userId, final String fileHash, final InputStream inputStream,
                         final ObjectMetadata metadata) {
    final String key = generateFileKey(userId, fileHash);
    amazonS3.putObject(bucketName, key, inputStream, metadata);
    log.info("Uploaded file [{}] to storage", key);
  }

  public Resource downloadFile(final long userId, final String fileHash) {
    final String key = generateFileKey(userId, fileHash);
    try {
      final S3Object s3Object = amazonS3.getObject(bucketName, key);
      return new InputStreamResource(s3Object.getObjectContent());
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

  public URL getFileUrl(final long userId, final String fileHash) {
    final String key = generateFileKey(userId, fileHash);
    try {
      return amazonS3.getUrl(bucketName, key);
    } catch (final Exception e) {
      log.error("Error when getting file URL [{}] from storage", key, e);
    }
    return null;
  }

  private String generateFileKey(final long userId, final String fileName) {
    return userId + "/" + fileName;
  }
}
