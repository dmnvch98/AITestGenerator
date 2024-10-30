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

    private final List<FileUploadResult> fileResults;

    @AllArgsConstructor
    @Getter
    public static class FileUploadResult {

        private final String fileName;
        private final UploadStatus status;
        private final String description;

        @Builder
        public FileUploadResult(String fileName, UploadStatus status) {
            this.fileName = fileName;
            this.status = status;
            this.description = status.getDescription();
        }
    }
}
