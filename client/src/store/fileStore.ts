import create from 'zustand';
import FileService from '../services/FileService';
import { AxiosError } from 'axios';
import {AlertMessage} from "./types";

export interface FileDto {
    id: number;
    originalFilename: string;
    hashedFilename: string;
    userId: number;
    uploadTime: Date;
}

export const UploadStatus = {
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    ALREADY_UPLOADED: 'ALREADY_UPLOADED',
} as const;

export type UploadStatus = (typeof UploadStatus)[keyof typeof UploadStatus];

export const UploadStatusMessages: Record<UploadStatus, string> = {
    [UploadStatus.SUCCESS]: 'Файл успешно загружен',
    [UploadStatus.FAILED]: 'Не удалось загрузить файл',
    [UploadStatus.ALREADY_UPLOADED]: 'Файл с таким именем уже существует',
};

interface FileResult {
    fileName: string;
    status: UploadStatus;
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
    getFiles: () => Promise<void>;
    deleteFile: (fileDto: FileDto) => Promise<void>;
    setAlert: (alert: AlertMessage[]) => void;
    clearAlerts: () => void;
    deleteAlert: (alert: AlertMessage) => void;
    setFileDtos: (fileDtos: FileDto[]) => void;
    uploadModalOpen: boolean,
    setUploadModalOpen: (flag: boolean) => void;
    setIsLoading: (flag: boolean) => void;
    selectedFileHashes: string[];
    setSelectedFileHashes: (fileIds: number[]) => void;
    deleteFilesInBatch: () => void;
}

const useFileStore = create<FileStore>((set, get) => ({
    filesToUpload: [],
    fileDtos: [],
    alerts: [],
    isLoading: false,
    error: null,
    uploadModalOpen: false,
    selectedFileHashes: [],

    addFiles: (files) => set((state) => ({filesToUpload: [...state.filesToUpload, ...files]})),
    removeFile: (index) => set((state) => ({filesToUpload: state.filesToUpload.filter((_, i) => i !== index)})),
    clearFiles: () => set({filesToUpload: []}),

    setAlert: (alerts) => set((state) => ({alerts: [...state.alerts, ...alerts]})),
    clearAlerts: () => set({alerts: []}),
    setFileDtos: (fileDtos: FileDto[]) => {set({fileDtos: fileDtos});},
    deleteAlert: (alertToDelete) => set((state) => ({
        alerts: state.alerts.filter(alert => alert.id !== alertToDelete.id)
    })),

    uploadFiles: async () => {
        const { filesToUpload, setAlert, clearFiles, getFiles } = get();
        set({ isLoading: true, error: null });

        try {
            const response = await FileService.uploadFiles(filesToUpload);
            if (response && response.fileResults.length > 0) {
                response.fileResults.map(resp => {
                    if (resp.status === UploadStatus.ALREADY_UPLOADED ) {
                        console.log(2)
                        setAlert([{id: Date.now(), message: UploadStatusMessages[resp.status] + ' - ' + resp.fileName, severity: 'warning'}])
                    }
                })
            }
            setAlert([{id: Date.now(), message: 'Загрузка файлов завершена', severity: 'success'}]);
            clearFiles();
        } catch (error) {
            const axiosError = error as AxiosError;
            setAlert([{ id: Date.now(), message: 'Ошибка при загрузке файлов: ' + (axiosError.response?.data || axiosError.message), severity: 'error' }]);
            set({ error: axiosError.message });
        } finally {
            set({ isLoading: false });
            getFiles();
        }
    },

    getFiles: async () => {
        const response = await FileService.getFiles();
        const { setFileDtos } = get();
        setFileDtos(response);
    },

    deleteFile: async (fileDto: FileDto) => {
        const { setAlert, getFiles } = get();
        const response = await FileService.deleteFile(fileDto.hashedFilename);

        response === 204
            ? setAlert([{ id: Date.now(), message: `Файл <b>${fileDto.originalFilename}</b> успешно удален`, severity: 'success' }])
            : setAlert([{ id: Date.now(), message: `Ошибка при удалении <b>${fileDto.originalFilename}</b>`, severity: 'error' }]);

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
        const { selectedFileHashes, setAlert, getFiles} = get();
        const response = await FileService.deleteFilesInBatch(selectedFileHashes);
        response === 204
            ? setAlert([{ id: Date.now(), message: `Файлы успешно удалены`, severity: 'success' }])
            : setAlert([{ id: Date.now(), message: `Ошибка при удалении файлов`, severity: 'error' }]);
        set({selectedFileHashes: []});
        getFiles();
    }
}));

export default useFileStore;
