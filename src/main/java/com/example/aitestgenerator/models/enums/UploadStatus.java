package com.example.aitestgenerator.models.enums;

import lombok.Getter;

@Getter
public enum UploadStatus {

    SUCCESS("Загрузка завершена успешно"),
    FAILED("Загрузка не удалась из-за ошибки"),
    ALREADY_UPLOADED("Файл уже был загружен"),
    INVALID_EXTENSION("Файл имеет недопустимое расширение"),
    TOO_LARGE("Длина текста слишком большая. Попробуйте уменьшить текст");

    private final String description;

    UploadStatus(String description) {
        this.description = description;
    }
}
