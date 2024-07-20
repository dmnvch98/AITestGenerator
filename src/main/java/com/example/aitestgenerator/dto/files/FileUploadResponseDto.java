package com.example.aitestgenerator.dto.files;

import com.example.aitestgenerator.models.enums.UploadStatus;
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
    }
}
