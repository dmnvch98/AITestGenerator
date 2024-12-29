package com.example.generation_service.models.enums;

import lombok.Getter;

@Getter
public enum UploadStatus {

    SUCCESS,
    IN_PROCESS,
    FAILED,
    ALREADY_UPLOADED,
    INVALID_EXTENSION,
    TOO_LARGE,
    MALWARE

}
