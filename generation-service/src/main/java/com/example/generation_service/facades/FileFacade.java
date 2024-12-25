package com.example.generation_service.facades;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


import com.example.generation_service.annotations.cid.GenerateCid;
import com.example.generation_service.annotations.enumeration.ActionType;
import com.example.generation_service.annotations.enumeration.CidType;
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
  private final FileWorker fileWorker;

  @TrackAction(ActionType.UPLOAD_FILES)
  @GenerateCid(CidType.RANDOM)
  public FileUploadResponseDto saveFiles(final Long userId, final List<MultipartFile> files, final boolean overwrite, final boolean createCopy) {
    final List<FileUploadResponseDto.FileUploadResult> uploadResults = new ArrayList<>();
    for (MultipartFile file : files) {
        final FileUploadResponseDto.FileUploadResult result = fileWorker.saveFile(userId, file, overwrite, createCopy);
        uploadResults.add(result);
    }

    return FileUploadResponseDto.builder().uploadResults(uploadResults).build();
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
