import { create } from 'zustand';
import FileService from '../services/FileService';
import { AxiosError } from 'axios';
import {AlertMessage, QueryOptions} from "./types";
import {v4 as uuidv4} from "uuid";
import NotificationService from "../services/notification/NotificationService";

export interface FileDto {
    id: number;
    originalFilename: string;
    hashedFilename: string;
    userId: number;
    uploadTime: Date;
}

export enum UploadStatus {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    ALREADY_UPLOADED = 'ALREADY_UPLOADED',
    INVALID_EXTENSION = 'INVALID_EXTENSION',
    TOO_LARGE = 'TOO_LARGE',
    MALWARE = 'MALWARE'
}

const severityMap: Record<UploadStatus, 'success' | 'info' | 'warning' | 'error'> = {
    [UploadStatus.SUCCESS]: 'success',
    [UploadStatus.FAILED]: 'error',
    [UploadStatus.ALREADY_UPLOADED]: 'error',
    [UploadStatus.INVALID_EXTENSION]: 'error',
    [UploadStatus.TOO_LARGE]: 'error',
    [UploadStatus.MALWARE]: 'error'
};

interface FileResult {
    fileName: string;
    status: UploadStatus;
    description: string;
}

export interface FileUploadResponseDto {
    uploadResults: FileResult[];
}

interface FileStore {
    filesToUpload: File[];
    fileDtos: FileDto[];
    isLoading: boolean;
    error: string | null;
    addFiles: (files: File[]) => void;
    removeFile: (index: number) => void;
    clearFiles: () => void;
    uploadFiles: () => Promise<void>;
    getFiles: (options?: QueryOptions) => Promise<void>;
    deleteFile: (fileDto: FileDto) => Promise<void>;
    uploadModalOpen: boolean,
    setUploadModalOpen: (flag: boolean) => void;
    setIsLoading: (flag: boolean) => void;
    selectedFileHashes: string[];
    setSelectedFileHashes: (fileIds: number[]) => void;
    deleteFilesInBatch: () => void;
    totalUserFiles: number;
    validateFilesThenUpload: (newFiles: File[]) => void;
}

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

const useFileStore = create<FileStore>((set, get) => ({
    filesToUpload: [],
    fileDtos: [],
    isLoading: false,
    error: null,
    uploadModalOpen: false,
    selectedFileHashes: [],
    totalUserFiles: 0,

    addFiles: (files) => set((state) => ({filesToUpload: [...state.filesToUpload, ...files]})),
    removeFile: (index) => set((state) => ({filesToUpload: state.filesToUpload.filter((_, i) => i !== index)})),
    clearFiles: () => set({filesToUpload: []}),
    validateFilesThenUpload: (newFiles: File[]) => {
        const {filesToUpload, addFiles} = get();
        const validFiles: File[] = [];
        const invalidFiles: AlertMessage[] = [];

        if (newFiles.length > MAX_FILES) {
            NotificationService.addAlert(new AlertMessage(`Вы превысили лимит по количеству файлов. Максимум ${MAX_FILES} файлов.`, 'error'));
            return;
        }

        newFiles.forEach(file => {
            if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
                invalidFiles.push({
                    id: uuidv4() + Math.random(),
                    message: `<b>${file.name}</b> не PDF/Word документ`,
                    severity: 'error'
                });
            } else if (file.size > MAX_FILE_SIZE) {
                invalidFiles.push({
                    id: uuidv4() + Math.random(),
                    message: `<b>${file.name}</b> превышает ${MAX_FILE_SIZE_MB} MБ`,
                    severity: 'error'
                });
            } else if (filesToUpload.length + validFiles.length >= MAX_FILES) {
                invalidFiles.push({
                    id: uuidv4() + Math.random(),
                    message: `<b>${file.name}</b> превышает лимит в ${MAX_FILES} файлов`,
                    severity: 'error'
                });
            } else {
                validFiles.push(file);
            }
        });

        NotificationService.addAlerts(invalidFiles);
        addFiles(validFiles);
    },
    uploadFiles: async () => {
        const { filesToUpload, clearFiles, getFiles } = get();
        set({ isLoading: true, error: null });

        try {
            const response = await FileService.uploadFiles(filesToUpload);
            if (response?.uploadResults.length) {
                response.uploadResults.forEach(({ status, description, fileName }) => {
                    const severity = severityMap[status];
                    if (severity) {
                        const message = `${description} - <b>${fileName}</b>`;
                        const alert = new AlertMessage(message, severity);
                        NotificationService.addAlert(alert);
                    } else {
                        console.error('Severity not found for status:', status);
                    }
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            NotificationService.addAlert({ id: uuidv4(), message: 'Ошибка при загрузке файлов', severity: 'error' });
            set({ error: axiosError.message });
        } finally {
            clearFiles();
            set({ isLoading: false });
            getFiles();
        }
    },

    getFiles: async (options?: QueryOptions) => {
        const { fileHashes, totalElements } = await FileService.getFiles(options);
        set({fileDtos: fileHashes, totalUserFiles: totalElements})
    },

    deleteFile: async (fileDto: FileDto) => {
        const { getFiles } = get();
        const response = await FileService.deleteFile(fileDto.hashedFilename);

        response === 204
            ? NotificationService.addAlert({ id: uuidv4(), message: `Файл <b>${fileDto.originalFilename}</b> успешно удален`, severity: 'success' })
            : NotificationService.addAlert({ id: uuidv4(), message: `Ошибка при удалении <b>${fileDto.originalFilename}</b>`, severity: 'error' });

        getFiles();
    },
    setUploadModalOpen: (flag) => {
        set({uploadModalOpen: flag})
    },
    setIsLoading: (flag) => {
        set({isLoading: flag})
    },
    setSelectedFileHashes: (fileIds) => {
        const { fileDtos } = get();
        const hashedFileNames: string[] = fileDtos
            .filter(dto => fileIds.includes(dto.id))
            .map(dto => dto.hashedFilename);
        set({selectedFileHashes: hashedFileNames});
    },
    deleteFilesInBatch: async () => {
        const { selectedFileHashes, getFiles} = get();
        const response = await FileService.deleteFilesInBatch(selectedFileHashes);
        response === 204
            ? NotificationService.addAlert({ id: uuidv4(), message: `Файлы успешно удалены`, severity: 'success' })
            : NotificationService.addAlert({ id: uuidv4(), message: `Ошибка при удалении файлов`, severity: 'error' });
        set({selectedFileHashes: []});
        getFiles();
    },
}));

export default useFileStore;
