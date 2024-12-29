export interface FileDto {
    id: number;
    originalFilename: string;
    hashedFilename: string;
    userId: number;
    uploadTime: Date;
}

export interface FileExistsResponseDto {
    fileName: string,
    exists: boolean;
}

export enum UploadStatus {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    ALREADY_UPLOADED = 'ALREADY_UPLOADED',
    INVALID_EXTENSION = 'INVALID_EXTENSION',
    TOO_LARGE = 'TOO_LARGE',
    MALWARE = 'MALWARE'
}

export const UploadStatusDescriptions: Record<UploadStatus, string> = {
    [UploadStatus.SUCCESS]: 'Загрузка завершена успешно',
    [UploadStatus.FAILED]: 'Загрузка не удалась из-за ошибки',
    [UploadStatus.ALREADY_UPLOADED]: 'Файл уже был загружен',
    [UploadStatus.INVALID_EXTENSION]: 'Файл имеет недопустимое расширение',
    [UploadStatus.TOO_LARGE]: 'Длина текста слишком большая. Попробуйте уменьшить текст',
    [UploadStatus.MALWARE]: 'Подозрительный файл. Попробуйте загрузить в другом формате'
};

interface FileResult {
    fileMetadata: FileDto;
    fileName: string;
    status: UploadStatus;
    description: string;
}

export interface FileUploadResponseDto {
    uploadResults: FileResult[];
}

export interface UploadOptions {
    overwrite?: boolean;
    createCopy?: boolean;
}