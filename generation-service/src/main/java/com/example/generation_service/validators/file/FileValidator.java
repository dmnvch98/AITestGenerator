package com.example.generation_service.validators.file;

import com.example.generation_service.validators.file.dto.FileValidationDto;

@FunctionalInterface
public interface FileValidator {

    FileValidationDto validate(final FileValidationDto dto);
}
