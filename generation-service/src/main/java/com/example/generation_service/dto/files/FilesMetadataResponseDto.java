package com.example.generation_service.dto.files;

import java.util.List;


import com.example.generation_service.models.files.FileMetadata;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class FilesMetadataResponseDto {

  private final List<FileMetadata> fileHashes;
  private final long totalPages;
  private final long totalElements;
}
