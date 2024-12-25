package com.example.generation_service.workers;

import com.amazonaws.services.s3.model.ObjectMetadata;
import com.example.generation_service.converters.FileHashConverter;
import com.example.generation_service.dto.files.FileUploadResponseDto;
import com.example.generation_service.models.files.FileHash;
import com.example.generation_service.models.enums.UploadStatus;
import com.example.generation_service.services.FileHashService;
import com.example.generation_service.services.aws.StorageClient;
import com.example.generation_service.validators.file.FileValidator;
import com.example.generation_service.validators.file.dto.FileValidationDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class FileWorker {

    private final StorageClient storageClient;
    private final List<FileValidator> fileValidators;
    private final FileHashConverter converter;
    private final FileHashService fileHashService;

    @Transactional
    public FileUploadResponseDto.FileUploadResult saveFile(final long userId, final MultipartFile file) {
        FileValidationDto validationDto;
        try {
            validationDto = validateFile(file, userId);
        } catch (final Exception e) {
            return buildResponse(UploadStatus.FAILED, file, null);
        }

        if (!validationDto.getUploadStatus().equals(UploadStatus.SUCCESS)) {
            return buildResponse(validationDto.getUploadStatus(), file, null);
        }

        final String originalFileName = file.getOriginalFilename();

        final String fileNameHash = DigestUtils.md5Hex(originalFileName + System.currentTimeMillis());

        try {
//            final String originalFileName = file.getOriginalFilename();
            final ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());

//            final String fileNameHash = DigestUtils.md5Hex(originalFileName + System.currentTimeMillis());

            storageClient.uploadFile(userId, fileNameHash, originalFileName, file.getInputStream(), metadata);

            final FileHash fileHash = converter.convertToFileHash(fileNameHash, originalFileName, userId,
                    validationDto.getFileData());

            fileHashService.save(fileHash);
        } catch (IOException e) {
            log.error("Error when saving file: {} for user id: {}", file.getOriginalFilename(), userId, e);
            return buildResponse(UploadStatus.FAILED, file, null);
        }
        return buildResponse(UploadStatus.SUCCESS, file, fileNameHash);
    }

    @Transactional
    public void deleteFileByHash(final long userId, final String hash) {
        fileHashService.isExistsByHashedFilenameAndUserOrThrow(userId, hash);
        try {
            storageClient.deleteFile(userId, hash);
            fileHashService.delete(userId, hash);
        } catch (final Exception e) {
            log.error("An error occurred when deleting file by hash [{}]", hash);
        }
    }

    private FileValidationDto validateFile(final MultipartFile file, final Long userId) {
        log.info("Starting file validation before uploading: [{}]", file.getOriginalFilename());
        final FileValidationDto dto = converter.convertToValidateDto(file, userId);
        for (final FileValidator validator : fileValidators) {
            final UploadStatus validationStatus = validator.validate(dto).getUploadStatus();
            if (validationStatus != UploadStatus.SUCCESS) {
                log.info("File [{}] didn't pass validation by reason [{}]", file.getOriginalFilename(), validationStatus);
                return dto;
            }
        }
        return dto;
    }

    private FileUploadResponseDto.FileUploadResult buildResponse(final UploadStatus status, final MultipartFile file, final String hashedFileName) {
        return FileUploadResponseDto
                .FileUploadResult
                .builder()
                .fileName(file.getOriginalFilename())
                .fileHash(hashedFileName)
                .status(status)
                .build();
    }
}
