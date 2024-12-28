package com.example.generation_service.controllers;

import com.example.generation_service.config.security.service.PrincipalUser;
import com.example.generation_service.dto.files.FileExistsResponseDto;
import com.example.generation_service.dto.files.FileUploadResponseDto;
import com.example.generation_service.dto.files.FilesMetadataResponseDto;
import com.example.generation_service.facades.FileFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/files")
@RequiredArgsConstructor
public class FileController {

  private final FileFacade fileFacade;

  @PostMapping("/")
  @ResponseStatus(HttpStatus.CREATED)
  public ResponseEntity<FileUploadResponseDto> uploadFile(
          @RequestParam("file") final List<MultipartFile> files,
          @RequestParam(value = "overwrite", required = false, defaultValue = "false") final boolean overwrite,
          @RequestParam(value = "createCopy", required = false, defaultValue = "false") final boolean createCopy,
          final Authentication authentication) {
    final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();

    final FileUploadResponseDto result = fileFacade.saveFiles(userId, files, overwrite, createCopy);
    return ResponseEntity.of(Optional.of(result));
  }


  @GetMapping("/{fileHash}")
  public Resource getFileByHash(@PathVariable final String fileHash, final Authentication authentication) {
    final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
    return fileFacade.getFileByHash(userId, fileHash);
  }

  @DeleteMapping("/{fileHash}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteFile(@PathVariable final String fileHash, final Authentication authentication) {
    final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
    fileFacade.deleteFile(userId, fileHash);
  }

  @GetMapping("/")
  public FilesMetadataResponseDto getAllByUserId(final Authentication authentication) {
    final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
    return fileFacade.getAllUserFileDescriptions(userId);
  }

  @GetMapping("/filter")
  public FilesMetadataResponseDto getUserFileHashes(
          final Authentication authentication,
          @RequestParam(required = false) String search,
          @RequestParam(defaultValue = "0") int page,
          @RequestParam(defaultValue = "10") int size,
          @RequestParam(required = false, defaultValue = "id") String sortBy,
          @RequestParam(required = false, defaultValue = "asc") String sortDirection
  ) {
    final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
    return fileFacade.getUserFileHashes(userId, search, page, size, sortBy, sortDirection);
  }

  @PostMapping("/delete")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteInBatch(@RequestBody List<String> hashes, Authentication authentication) {
    final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
    fileFacade.deleteFiles(userId, hashes);
  }

  @GetMapping("/{originalFileName}/exists")
  public FileExistsResponseDto isFileExists(final Authentication authentication, @PathVariable String originalFileName) {
    final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
    return fileFacade.isFileExists(userId, originalFileName);
  }

}
