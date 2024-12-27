package com.example.generation_service.dto.texts;

import java.util.List;


import com.example.generation_service.models.files.FileMetadata;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class FileHashesResponseDto {

  private final List<FileMetadata> fileHashes;
  private final long totalPages;
  private final long totalElements;
}
