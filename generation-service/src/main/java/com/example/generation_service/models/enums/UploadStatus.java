package com.example.generation_service.models.enums;

import lombok.Getter;

@Getter
public enum UploadStatus {

    SUCCESS("Загрузка завершена успешно"),
    IN_PROCESS("Файл загружается"),
    FAILED("Загрузка не удалась из-за ошибки"),
    ALREADY_UPLOADED("Файл уже был загружен"),
    INVALID_EXTENSION("Файл имеет недопустимое расширение"),
    TOO_LARGE("Длина текста слишком большая. Попробуйте уменьшить текст"),
    MALWARE("Подозрительный файл. Побройте загрузить в другом формате");

    private final String description;

    UploadStatus(String description) {
        this.description = description;
    }
}
