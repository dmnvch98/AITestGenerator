package com.example.generation_service.converters;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


import com.example.generation_service.dto.files.FilesMetadataResponseDto;
import com.example.generation_service.models.files.FileMetadata;
import com.example.generation_service.validators.file.dto.FileValidationDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

@Mapper
public interface FileHashConverter {

  ObjectMapper MAPPER = new ObjectMapper();

  default FilesMetadataResponseDto convert(final List<FileMetadata> fileHashes) {
    return FilesMetadataResponseDto.builder().fileHashes(fileHashes).build();
  }

  default FilesMetadataResponseDto convert(final Page<FileMetadata> fileHashes) {
    return FilesMetadataResponseDto.builder()
            .fileHashes(fileHashes.getContent())
            .totalElements(fileHashes.getTotalElements())
            .totalPages(fileHashes.getTotalPages())
            .build();
  }

  default FileValidationDto convertToValidateDto(final MultipartFile file, final Long userId, final boolean overwrite, final boolean createCopy) {
    return FileValidationDto.builder()
            .file(file)
            .userId(userId)
            .overwrite(overwrite)
            .createCopy(createCopy)
            .build();
  }

  default String convertToFileDataJson(final Map<String, String> fileData) throws JsonProcessingException {
    if (fileData == null || fileData.isEmpty()) {
      return null;
    }
    return MAPPER.writeValueAsString(fileData);
  }

  default FileMetadata convertToFileHash(
          final String fileNameHash,
          final String originalFileName,
          final Long userId,
          final Map<String, String> fileData) throws JsonProcessingException {
    return FileMetadata.builder()
            .hashedFilename(fileNameHash)
            .originalFilename(originalFileName)
            .uploadTime(LocalDateTime.now())
            .userId(userId)
            .data(convertToFileDataJson(fileData))
            .build();
  }

}
