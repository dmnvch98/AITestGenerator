package com.example.generation_service.validators.file;

import com.example.generation_service.models.enums.UploadStatus;
import com.example.generation_service.validators.file.dto.FileValidationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class FileExtensionValidator implements FileValidator {

    @Value("${file-upload.allowed-extensions}")
    private List<String> allowedFileExtensions;

    @Override
    public FileValidationDto validate(final FileValidationDto dto) {
        final String fileName = dto.getFile().getOriginalFilename();
        boolean isValidExtension = Optional.ofNullable(fileName)
                .map(f -> f.substring(f.lastIndexOf('.') + 1).toLowerCase())
                .map(allowedFileExtensions::contains)
                .orElse(false);

        final UploadStatus uploadStatus = isValidExtension ? UploadStatus.SUCCESS : UploadStatus.INVALID_EXTENSION;
        dto.setUploadStatus(uploadStatus);
        return dto;
    }
}
