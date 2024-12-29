import { create } from 'zustand';
import FileService from '../../../services/FileService';
import {AlertMessage, QueryOptions} from "../../../store/types";
import {v4 as uuidv4} from "uuid";
import NotificationService from "../../../services/notification/AlertService";
import {validateFiles} from "../helper";
import {FileDto, FileExistsResponseDto, FileUploadResponseDto, UploadOptions, UploadStatus} from "../types";

interface FileStore {
    filesToUpload: File[];
    userFiles: FileDto[];
    isLoading: boolean;
    addFiles: (files: File[]) => void;
    clearFiles: () => void;

    /*Server calls*/
    uploadUserFiles: (uploadOptions?: UploadOptions) => Promise<{status: UploadStatus}>;
    getUserFiles: (options?: QueryOptions) => Promise<FileDto[]>;
    deleteUserFile: (fileDto: FileDto) => Promise<void>;
    deleteFilesInBatch: () => void;
    isFileExists: (fileName: string) => Promise<FileExistsResponseDto>
    downloadFile: (fileHash: string) => Promise<void>

    selectedFile: FileDto | null;
    setSelectedFile: (file: FileDto | null) => void;
    selectedFileHashes: string[];
    setSelectedFileHashes: (fileIds: number[]) => void;

    totalUserFiles: number;
    totalPages: number;
    validateFilesThenUpload: (newFiles: File[]) => void;
}

const useFileStore = create<FileStore>((set, get) => ({
    filesToUpload: [],
    userFiles: [],
    isLoading: false,
    uploaded: false,
    selectedFileHashes: [],
    totalUserFiles: 0,
    totalPages: 0,
    selectedFile: null,

    addFiles: (files) => set((state) => ({filesToUpload: [...state.filesToUpload, ...files]})),
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
    isFileExists: async (fileName: string): Promise<FileExistsResponseDto> => {
        set({isLoading: true});
        const result = await FileService.isFileExists(fileName);
        set({isLoading: false});

        return result;
    },
    uploadUserFiles: async (uploadOptions?: UploadOptions): Promise<{ status: UploadStatus }> => {
        const { filesToUpload, clearFiles } = get();
        set({ isLoading: true});

        try {
            const response = await FileService.uploadFiles(filesToUpload, uploadOptions) as FileUploadResponseDto;
            if (response?.uploadResults?.length) {
                const result = response.uploadResults[0];
                const {status, description, fileName, fileMetadata} = result;
                if (status != UploadStatus.SUCCESS) {
                    const message = `${description} - <b>${fileName}</b>`;
                    const alert = new AlertMessage(message, 'error');
                    NotificationService.addAlert(alert);
                } else {
                    clearFiles();
                    set({selectedFile: fileMetadata, filesToUpload: []});
                }
                set({isLoading: false});
                return {status};
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

    getUserFiles: async (options?: QueryOptions) => {
        set({isLoading: true});
        const { fileHashes, totalElements, totalPages } = await FileService.getFiles(options);
        set({userFiles: fileHashes, totalUserFiles: totalElements, isLoading: false, totalPages: totalPages})
        return fileHashes;
    },

    deleteUserFile: async (fileDto: FileDto) => {
        const { getUserFiles } = get();
        const response = await FileService.deleteFile(fileDto.hashedFilename);

        response === 204
            ? NotificationService.addAlert({ id: uuidv4(), message: `Файл <b>${fileDto.originalFilename}</b> успешно удален`, severity: 'success' })
            : NotificationService.addAlert({ id: uuidv4(), message: `Ошибка при удалении <b>${fileDto.originalFilename}</b>`, severity: 'error' });

        getUserFiles();
    },
    setSelectedFileHashes: (fileIds) => {
        const { userFiles } = get();
        const hashedFileNames: string[] = userFiles
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
        const { selectedFileHashes, getUserFiles} = get();
        const response = await FileService.deleteFilesInBatch(selectedFileHashes);
        NotificationService.deleteAlert(alert);
        response === 204
            ? NotificationService.addAlert({ id: uuidv4(), message: `Файлы успешно удалены`, severity: 'success' })
            : NotificationService.addAlert({ id: uuidv4(), message: `Ошибка при удалении файлов`, severity: 'error' });
        set({selectedFileHashes: []});
        getUserFiles();
        set({isLoading: false})
    },
    setSelectedFile: async (file) => {
        set({selectedFile: file});
    },
    downloadFile: async (fileHash) => {
        await FileService.getFileByHash(fileHash);
    }
}));

export default useFileStore;
