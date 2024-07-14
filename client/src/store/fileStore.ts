import create from 'zustand';
import FileService from '../services/FileService';
import { AxiosError } from 'axios';

export interface AlertMessage {
    id: number;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error' | undefined;
}

export interface FileDto {
    id: number;
    originalFilename: string;
    hashedFilename: string;
    userId: number;
    uploadTime: Date;
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
}

const useFileStore = create<FileStore>((set, get) => ({
    filesToUpload: [],
    fileDtos: [],
    alerts: [],
    isLoading: false,
    error: null,
    uploadModalOpen: false,

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
            await FileService.uploadFiles(filesToUpload);
            setAlert([{ id: Date.now(), message: 'Файл(ы) успешно загружены', severity: 'success' }]);
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
    }
}));

export default useFileStore;
