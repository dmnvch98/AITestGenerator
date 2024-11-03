package com.example.generation_service.facades;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;


import com.example.generation_service.annotations.enumeration.ActionType;
import com.example.generation_service.annotations.useractions.TrackAction;
import com.example.generation_service.converters.FileHashConverter;
import com.example.generation_service.dto.files.FileUploadResponseDto;
import com.example.generation_service.dto.texts.FileHashesResponseDto;
import com.example.generation_service.models.files.FileHash;
import com.example.generation_service.services.FileHashService;
import com.example.generation_service.services.aws.StorageClient;
import com.example.generation_service.workers.FileWorker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
@RequiredArgsConstructor
@Slf4j
public class FileFacade {

  private final FileHashService fileHashService;
  private final StorageClient storageClient;
  private final FileHashConverter converter;
  private final ExecutorService executorService = Executors.newFixedThreadPool(10);
  private final FileWorker fileWorker;

  @TrackAction(ActionType.UPLOAD_FILES)
  public FileUploadResponseDto saveFiles(final Long userId, final List<MultipartFile> files) {
    final List<FileUploadResponseDto.FileUploadResult> fileResults = new ArrayList<>();
    final List<Future<FileUploadResponseDto.FileUploadResult>> futures = new ArrayList<>();

    for (final MultipartFile file : files) {
      final Callable<FileUploadResponseDto.FileUploadResult> task = () -> fileWorker.saveFile(userId, file);
      futures.add(executorService.submit(task));
    }

    for (Future<FileUploadResponseDto.FileUploadResult> future : futures) {
      try {
        final FileUploadResponseDto.FileUploadResult result = future.get();
        fileResults.add(result);
      } catch (InterruptedException | ExecutionException e) {
        log.error("An error occurred when uploading a file", e);
      }
    }

    return FileUploadResponseDto.builder().fileResults(fileResults).build();
  }

  public Resource getFileByHash(final long userId, final String hash) {
    fileHashService.isExistsByHashedFilenameAndUserOrThrow(userId, hash);
    return storageClient.downloadFile(userId, hash);
  }

  @TrackAction(ActionType.DELETE_FILES)
  public void deleteFiles(final long userId, final List<String> hashes) {
    hashes.forEach(hash -> fileWorker.deleteFileByHash(userId, hash));
  }

  @TrackAction(ActionType.DELETE_FILES)
  public void deleteFile(final long userId, final String hash) {
    fileWorker.deleteFileByHash(userId, hash);
  }

  public FileHashesResponseDto getAllUserFileDescriptions(final long userId) {
    return converter.convert(fileHashService.getAllByUserId(userId));
  }

  public FileHashesResponseDto getUserFileHashes(final Long userId, final String search, final int page, final int size,
                                                 final String sortBy, final String sortDirection) {
    Page<FileHash> fileHashPage = fileHashService.getUserFileHashes(userId, search, page, size, sortBy, sortDirection);
    return converter.convert(fileHashPage);
  }
}
