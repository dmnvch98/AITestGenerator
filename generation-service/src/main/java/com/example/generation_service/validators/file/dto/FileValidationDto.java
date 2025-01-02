package com.example.generation_service.validators.file.dto;

import com.example.generation_service.models.enums.UploadStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Setter
@Getter
@Builder
public class FileValidationDto {

    private final MultipartFile file;
    private UploadStatus uploadStatus;
    private Map<String, String> fileData;
    private final Long userId;
    private final boolean overwrite;
    private final boolean createCopy;

    public void addFileData(final String key, final String value) {
        if (fileData == null) {
            fileData = new HashMap<>();
        }
        fileData.put(key, value);
    }
}