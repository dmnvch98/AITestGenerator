package com.example.aitestgenerator.dto.texts;

import java.util.List;


import com.example.aitestgenerator.models.FileHash;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class FileHashesResponseDto {

  private final List<FileHash> fileHashes;
}
