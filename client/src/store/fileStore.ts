import { create } from 'zustand';
import FileService from '../services/FileService';
import { AxiosError } from 'axios';
import {AlertMessage, QueryOptions} from "./types";
import {v4 as uuidv4} from "uuid";

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
    fileResults: FileResult[];
}

interface FileStore {
    filesToUpload: File[];
    fileDtos: FileDto[];
    alerts: AlertMessage[];
    isLoading: boolean;
    error: string | null;
    addFiles: (files: File[]) => void;
    removeFile: (index: number) => void;
    clearFiles: () => void;
    uploadFiles: () => Promise<void>;
    getFiles: (options?: QueryOptions) => Promise<void>;
    deleteFile: (fileDto: FileDto) => Promise<void>;
    setAlerts: (alert: AlertMessage[]) => void;
    addAlert: (alert: AlertMessage) => void;
    clearAlerts: () => void;
    deleteAlert: (alert: AlertMessage) => void;
    uploadModalOpen: boolean,
    setUploadModalOpen: (flag: boolean) => void;
    setIsLoading: (flag: boolean) => void;
    selectedFileHashes: string[];
    setSelectedFileHashes: (fileIds: number[]) => void;
    deleteFilesInBatch: () => void;
    totalUserFiles: number;
}

const useFileStore = create<FileStore>((set, get) => ({
    filesToUpload: [],
    fileDtos: [],
    alerts: [],
    isLoading: false,
    error: null,
    uploadModalOpen: false,
    selectedFileHashes: [],
    totalUserFiles: 0,

    addFiles: (files) => set((state) => ({filesToUpload: [...state.filesToUpload, ...files]})),
    removeFile: (index) => set((state) => ({filesToUpload: state.filesToUpload.filter((_, i) => i !== index)})),
    clearFiles: () => set({filesToUpload: []}),

    setAlerts: (alerts) => set((state) => ({alerts: [...state.alerts, ...alerts]})),
    addAlert: (alert: AlertMessage) => {
        get().alerts.push(alert);
    },
    clearAlerts: () => set({alerts: []}),
    deleteAlert: (alertToDelete) => set((state) => ({
        alerts: state.alerts.filter(alert => alert.id !== alertToDelete.id)
    })),

    uploadFiles: async () => {
        const { filesToUpload, addAlert, clearFiles, getFiles } = get();
        set({ isLoading: true, error: null });

        try {
            const response = await FileService.uploadFiles(filesToUpload);
            if (response?.fileResults.length) {
                response.fileResults.forEach(({ status, description, fileName }) => {
                    const severity = severityMap[status];
                    if (severity) {
                        const message = `${description} - <b>${fileName}</b>`;
                        const alert = new AlertMessage(message, severity);
                        addAlert(alert);
                    } else {
                        console.error('Severity not found for status:', status);
                    }
                });
            }
            clearFiles();
        } catch (error) {
            const axiosError = error as AxiosError;
            addAlert({ id: uuidv4(), message: 'Ошибка при загрузке файлов: ' + (axiosError.response?.data || axiosError.message), severity: 'error' });
            set({ error: axiosError.message });
        } finally {
            set({ isLoading: false });
            getFiles();
        }
    },

    getFiles: async (options?: QueryOptions) => {
        const { fileHashes, totalElements } = await FileService.getFiles(options);
        set({fileDtos: fileHashes, totalUserFiles: totalElements})
    },

    deleteFile: async (fileDto: FileDto) => {
        const { addAlert, getFiles } = get();
        const response = await FileService.deleteFile(fileDto.hashedFilename);

        response === 204
            ? addAlert({ id: uuidv4(), message: `Файл <b>${fileDto.originalFilename}</b> успешно удален`, severity: 'success' })
            : addAlert({ id: uuidv4(), message: `Ошибка при удалении <b>${fileDto.originalFilename}</b>`, severity: 'error' });

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
        const { selectedFileHashes, addAlert, getFiles} = get();
        const response = await FileService.deleteFilesInBatch(selectedFileHashes);
        response === 204
            ? addAlert({ id: uuidv4(), message: `Файлы успешно удалены`, severity: 'success' })
            : addAlert({ id: uuidv4(), message: `Ошибка при удалении файлов`, severity: 'error' });
        set({selectedFileHashes: []});
        getFiles();
    },
}));

export default useFileStore;
