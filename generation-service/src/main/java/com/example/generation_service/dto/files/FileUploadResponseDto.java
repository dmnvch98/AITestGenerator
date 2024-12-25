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

    private final List<FileUploadResult> uploadResults;

    @AllArgsConstructor
    @Getter
    public static class FileUploadResult {

        private final String fileName;
        private final String fileHash;
        private final UploadStatus status;
        private final String description;

        @Builder
        public FileUploadResult(String fileName, String fileHash, UploadStatus status) {
            this.fileName = fileName;
            this.fileHash = fileHash;
            this.status = status;
            this.description = status.getDescription();
        }
    }
}
