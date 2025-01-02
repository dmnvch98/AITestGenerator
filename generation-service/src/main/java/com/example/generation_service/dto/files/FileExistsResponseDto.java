package com.example.generation_service.dto.files;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class FileExistsResponseDto {

    private final String originalFileName;
    private final boolean exists;
}
