package com.example.generation_service.dto.files;

import com.example.generation_service.models.enums.UploadStatus;
import com.example.generation_service.models.files.FileMetadata;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Builder
@Getter
public class FileUploadResponseDto {

    private final List<FileUploadResult> uploadResults;

    @AllArgsConstructor
    @Getter
    public static class FileUploadResult {

        private final FileMetadata fileMetadata;
        private final UploadStatus status;
        private final String description;
        private final String fileName;

    }
}
