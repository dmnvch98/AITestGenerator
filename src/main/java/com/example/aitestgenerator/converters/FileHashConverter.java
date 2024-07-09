package com.example.aitestgenerator.converters;

import java.util.List;


import com.example.aitestgenerator.dto.texts.FileHashesResponseDto;
import com.example.aitestgenerator.models.FileHash;
import org.mapstruct.Mapper;

@Mapper
public interface FileHashConverter {

  default FileHashesResponseDto convert(final List<FileHash> fileHashes) {
    return FileHashesResponseDto.builder().fileHashes(fileHashes).build();
  }
}
