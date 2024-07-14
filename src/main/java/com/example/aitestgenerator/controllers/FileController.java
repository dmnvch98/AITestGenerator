package com.example.aitestgenerator.controllers;

import com.example.aitestgenerator.config.security.service.PrincipalUser;
import com.example.aitestgenerator.dto.texts.FileHashesResponseDto;
import com.example.aitestgenerator.facades.FileFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/v1/files")
@RequiredArgsConstructor
public class FileController {

  private final FileFacade fileFacade;

  @PostMapping("/")
  @ResponseStatus(HttpStatus.CREATED)
  public void uploadFile(@RequestParam("file") final List<MultipartFile> files, final Authentication authentication) {
    final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
    files.forEach(file -> fileFacade.saveFile(userId, file));
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

}
