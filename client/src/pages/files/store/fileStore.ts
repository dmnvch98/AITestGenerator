import { create } from 'zustand';
import FileService from '../../../services/FileService';
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
interface FileResult {
    fileMetadata: FileDto;
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
    setIsLoading: (flag: boolean) => void;
    error: string | null;
    addFiles: (files: File[]) => void;
    removeFile: (index: number) => void;
    clearFiles: () => void;
    uploadFiles: (override?: boolean, createCopy?: boolean) => Promise<{status: UploadStatus}>;
    getFiles: (options?: QueryOptions) => Promise<void>;
    deleteFile: (fileDto: FileDto) => Promise<void>;
    uploadModalOpen: boolean,
    setUploadModalOpen: (flag: boolean) => void;
    selectedFile: FileDto | null;
    setSelectedFile: (file: FileDto | null) => void;
    selectedFileHashes: string[];
    setSelectedFileHashes: (fileIds: number[]) => void;
    deleteFilesInBatch: () => void;
    totalUserFiles: number;
    totalPages: number;
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
    totalPages: 0,
    selectedFile: null,

    addFiles: (files) => set((state) => ({filesToUpload: [...state.filesToUpload, ...files]})),
    removeFile: (index) => set((state) => (
        {filesToUpload: state.filesToUpload.filter((_, i) => i !== index), selectedFile: null}
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
    uploadFiles: async (override?: boolean, createCopy?: boolean): Promise<{ status: UploadStatus }> => {
        const { filesToUpload, clearFiles } = get();
        set({ isLoading: true});

        try {
            const response = await FileService.uploadFiles(filesToUpload, override, createCopy) as FileUploadResponseDto;
            if (response?.uploadResults?.length) {
                const result = response.uploadResults[0];
                const { status, description, fileName, fileMetadata } = result;
                if (status != UploadStatus.SUCCESS) {
                    if (status !== UploadStatus.ALREADY_UPLOADED) {
                        const message = `${description} - <b>${fileName}</b>`;
                        const alert = new AlertMessage(message, 'error');
                        NotificationService.addAlert(alert);
                    }
                } else {
                    clearFiles();
                    set({ selectedFile: fileMetadata, filesToUpload: [] });
                }
                set({ isLoading: false });
                return { status };
            }

            return { status: UploadStatus.FAILED };
        } catch (error) {
            NotificationService.addAlert({
                id: uuidv4(),
                message: 'Ошибка при загрузке файлов',
                severity: 'error',
            });
            set({ isLoading: false });
            return { status: UploadStatus.FAILED };
        }
    },

    getFiles: async (options?: QueryOptions) => {
        set({isLoading: true});
        const { fileHashes, totalElements, totalPages } = await FileService.getFiles(options);
        set({fileDtos: fileHashes, totalUserFiles: totalElements, isLoading: false, totalPages: totalPages})
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
    setSelectedFile: async (file) => {
        set({selectedFile: file});
    },
    setIsLoading: (flag) => {
        set({isLoading: flag})
    }
}));

export default useFileStore;
