package com.example.generation_service.dto.files;

import com.example.generation_service.models.enums.UploadStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Builder
@Getter
public class FileUploadResponseDto {

    private final List<FileResult> fileResults;

    @AllArgsConstructor
    @Builder
    @Getter
    public static class FileResult {

        private final String fileName;
        private final UploadStatus status;
        private final String description;
    }
}
