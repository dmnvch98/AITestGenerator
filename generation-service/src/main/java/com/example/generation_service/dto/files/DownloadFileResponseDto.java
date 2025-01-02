package com.example.generation_service.dto.files;

import com.amazonaws.services.s3.model.S3Object;
import com.example.generation_service.models.files.FileMetadata;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class DownloadFileResponseDto {

    private final S3Object s3Object;
    private final FileMetadata metadata;
}
