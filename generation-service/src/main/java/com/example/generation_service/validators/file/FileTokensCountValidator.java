package com.example.generation_service.validators.file;

import com.example.generation_service.models.enums.UploadStatus;
import com.example.generation_service.services.FileExtractorService;
import com.example.generation_service.utils.Utils;
import com.example.generation_service.validators.file.dto.FileValidationDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
@Component
@RequiredArgsConstructor
@Slf4j
public class FileTokensCountValidator implements FileValidator {

    private final static Integer MAX_TOKENS = 6500;
    private final FileExtractorService fileExtractorService;

    @Override
    public FileValidationDto validate(final FileValidationDto dto) {
        try {
            final String fileContent = fileExtractorService.getContentFromFile(dto.getFile());
            final int tokensCount = Utils.countTokens(fileContent);
            final UploadStatus uploadStatus = tokensCount > MAX_TOKENS ? UploadStatus.TOO_LARGE : UploadStatus.SUCCESS;
            dto.setUploadStatus(uploadStatus);
            dto.addFileData("tokensCount", String.valueOf(tokensCount));
            return dto;
        } catch (final IOException e) {
            log.error("An error occurred when parsing file=[{}]",dto.getFile().getOriginalFilename());
            dto.setUploadStatus(UploadStatus.FAILED);
            return dto;
        }
    }
}
