package com.example.generation_service.validators.file.dto;

import com.example.generation_service.models.enums.UploadStatus;
import com.example.generation_service.services.FileHashService;
import com.example.generation_service.validators.file.FileValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Order(2)
public class DuplicateValidator implements FileValidator {

    private final FileHashService fileHashService;

    @Override
    public FileValidationDto validate(final FileValidationDto dto) {
        if (dto.isCreateCopy() || dto.isOverwrite()) {
            dto.setUploadStatus(UploadStatus.SUCCESS);
        } else {
            boolean isExists = fileHashService.isExistsByOriginalFilenameAndUserId(
                    dto.getUserId(), dto.getFile().getOriginalFilename());
            dto.setUploadStatus(isExists ? UploadStatus.ALREADY_UPLOADED : UploadStatus.SUCCESS);
        }
        return dto;
    }

}
