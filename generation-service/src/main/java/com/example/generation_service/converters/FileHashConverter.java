package com.example.generation_service.converters;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


import com.example.generation_service.dto.texts.FileHashesResponseDto;
import com.example.generation_service.models.FileHash;
import com.example.generation_service.validators.file.dto.FileValidationDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.mapstruct.Mapper;
import org.springframework.web.multipart.MultipartFile;

@Mapper
public interface FileHashConverter {

  ObjectMapper MAPPER = new ObjectMapper();

  default FileHashesResponseDto convert(final List<FileHash> fileHashes) {
    return FileHashesResponseDto.builder().fileHashes(fileHashes).build();
  }

  default FileValidationDto convertToValidateDto(final MultipartFile file, final Long userId) {
    return FileValidationDto.builder().file(file).userId(userId).build();
  }

  default String convertToFileDataJson(final Map<String, String> fileData) throws JsonProcessingException {
    if (fileData == null || fileData.isEmpty()) {
      return null;
    }
    return MAPPER.writeValueAsString(fileData);
  }

  default FileHash convertToFileHash(
          final String fileNameHash,
          final String originalFileName,
          final Long userId,
          final Map<String, String> fileData) throws JsonProcessingException {
    return FileHash.builder()
            .hashedFilename(fileNameHash)
            .originalFilename(originalFileName)
            .uploadTime(LocalDateTime.now())
            .userId(userId)
            .data(convertToFileDataJson(fileData))
            .build();
  }

}
