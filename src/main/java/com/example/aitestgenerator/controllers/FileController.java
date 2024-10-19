package com.example.aitestgenerator.controllers;

import com.example.aitestgenerator.config.security.service.PrincipalUser;
import com.example.aitestgenerator.dto.files.FileUploadResponseDto;
import com.example.aitestgenerator.dto.texts.FileHashesResponseDto;
import com.example.aitestgenerator.facades.FileFacade;
import com.example.aitestgenerator.models.enums.UploadStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
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
        @RequestParam("file")
        final List<MultipartFile> files,
        final Authentication authentication)
  {
    final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
    final List<FileUploadResponseDto.FileResult> fileResults = new ArrayList<>();
    for (final MultipartFile file : files) {
      final UploadStatus status = fileFacade.saveFile(userId, file);
      final FileUploadResponseDto.FileResult fileResult =
              FileUploadResponseDto.FileResult
                      .builder()
                      .status(status)
                      .description(status.getDescription())
                      .fileName(file.getOriginalFilename())
                      .build();
      fileResults.add(fileResult);
    }
    final FileUploadResponseDto result =  FileUploadResponseDto.builder().fileResults(fileResults).build();
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
    fileFacade.deleteFileByHash(userId, fileHash);
  }

  @GetMapping("/")
  public FileHashesResponseDto getAllByUserId(final Authentication authentication) {
    final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
    return fileFacade.getAllUserFileDescriptions(userId);
  }

  @PostMapping("/delete")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteInBatch(@RequestBody List<String> hashes, Authentication authentication) {
    final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
    hashes.forEach((hash) -> fileFacade.deleteFileByHash(userId, hash));
  }


}
