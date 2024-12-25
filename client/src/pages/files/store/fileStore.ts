import { create } from 'zustand';
import FileService from '../../../services/FileService';
import { AxiosError } from 'axios';
import {AlertMessage, QueryOptions} from "../../../store/types";
import {v4 as uuidv4} from "uuid";
import NotificationService from "../../../services/notification/AlertService";
import {validateFiles} from "../helper";

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
    fileHash: string;
    fileName: string;
    status: UploadStatus;
    description: string;
}

export interface FileUploadResponseDto {
    uploadResults: FileResult[];
}

interface FileStore {
    filesToUpload: File[];
    uploaded: boolean;
    fileDtos: FileDto[];
    isLoading: boolean;
    error: string | null;
    addFiles: (files: File[]) => void;
    removeFile: (index: number) => void;
    clearFiles: () => void;
    uploadFiles: () => Promise<{success: boolean, fileHash?: string}>;
    getFiles: (options?: QueryOptions) => Promise<void>;
    deleteFile: (fileDto: FileDto) => Promise<void>;
    uploadModalOpen: boolean,
    setUploadModalOpen: (flag: boolean) => void;
    selectedFileHashes: string[];
    setSelectedFileHashes: (fileIds: number[]) => void;
    deleteFilesInBatch: () => void;
    totalUserFiles: number;
    validateFilesThenUpload: (newFiles: File[]) => void;
}

const useFileStore = create<FileStore>((set, get) => ({
    filesToUpload: [],
    fileDtos: [],
    isLoading: false,
    uploaded: false,
    error: null,
    uploadModalOpen: false,
    selectedFileHashes: [],
    totalUserFiles: 0,

    addFiles: (files) => set((state) => ({filesToUpload: [...state.filesToUpload, ...files]})),
    removeFile: (index) => set((state) => (
        {filesToUpload: state.filesToUpload.filter((_, i) => i !== index), uploaded: false}
    )),
    clearFiles: () => set({filesToUpload: []}),
    validateFilesThenUpload: (newFiles: File[]) => {
        const { addFiles} = get();
        const { validFiles, invalidFilesAlerts } = validateFiles(newFiles)

        if (invalidFilesAlerts && invalidFilesAlerts.length) {
            NotificationService.addAlerts(invalidFilesAlerts);
        }
        if (validFiles && validFiles.length) {
            addFiles(validFiles);
        }
    },
    uploadFiles: async (): Promise<{success: boolean, fileHash?: string}> => {
        const { filesToUpload } = get();
        set({ isLoading: true, error: null });

        try {
            const response = await FileService.uploadFiles(filesToUpload);
            if (response?.uploadResults.length) {
                let hasSuccess = false;
                response.uploadResults.forEach(({ status, description, fileName }) => {
                    const severity = severityMap[status];
                    if (severity !== 'success') {
                        const message = `${description} - <b>${fileName}</b>`;
                        const alert = new AlertMessage(message, severity);
                        NotificationService.addAlert(alert);
                    }
                    if (status === UploadStatus.SUCCESS) {
                        hasSuccess = true;
                        set({uploaded: true});
                    }
                });
                return {
                    success: hasSuccess,
                    fileHash: response.uploadResults[0].fileHash
                };
            }
            return { success: false };
        } catch (error) {
            const axiosError = error as AxiosError;
            NotificationService.addAlert({ id: uuidv4(), message: 'Ошибка при загрузке файлов', severity: 'error' });
            set({ error: axiosError.message });
            return { success: false };
        } finally {
            set({ isLoading: false });
        }
    },

    getFiles: async (options?: QueryOptions) => {
        set({isLoading: true});
        const { fileHashes, totalElements } = await FileService.getFiles(options);
        set({fileDtos: fileHashes, totalUserFiles: totalElements, isLoading: false})
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
    setSelectedFileHashes: (fileIds) => {
        const { fileDtos } = get();
        const hashedFileNames: string[] = fileDtos
            .filter(dto => fileIds.includes(dto.id))
            .map(dto => dto.hashedFilename);
        set({selectedFileHashes: hashedFileNames});
    },
    deleteFilesInBatch: async () => {
        set({isLoading: true})
        const alert: AlertMessage = new AlertMessage(
            `Удаление файлов`,
            'info',
            'progress',
            false
        );
        NotificationService.addAlert(alert);
        const { selectedFileHashes, getFiles} = get();
        const response = await FileService.deleteFilesInBatch(selectedFileHashes);
        NotificationService.deleteAlert(alert);
        response === 204
            ? NotificationService.addAlert({ id: uuidv4(), message: `Файлы успешно удалены`, severity: 'success' })
            : NotificationService.addAlert({ id: uuidv4(), message: `Ошибка при удалении файлов`, severity: 'error' });
        set({selectedFileHashes: []});
        getFiles();
        set({isLoading: false})
    },
}));

export default useFileStore;
