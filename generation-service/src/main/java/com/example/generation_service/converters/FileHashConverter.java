package com.example.generation_service.converters;

import java.util.List;


import com.example.generation_service.dto.texts.FileHashesResponseDto;
import com.example.generation_service.models.FileHash;
import org.mapstruct.Mapper;

@Mapper
public interface FileHashConverter {

  default FileHashesResponseDto convert(final List<FileHash> fileHashes) {
    return FileHashesResponseDto.builder().fileHashes(fileHashes).build();
  }
}
