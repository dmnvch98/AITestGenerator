import { create } from 'zustand';
import FileService from '../../../services/FileService';
import {AlertMessage, QueryOptions} from "../../../store/types";
import NotificationService from "../../../services/notification/AlertService";
import {validateFiles} from "../helper";
import {
    FileDto,
    FileExistsResponseDto,
    FileUploadResponseDto,
    UploadOptions,
    UploadStatus,
    UploadStatusDescriptions
} from "../types";

interface FileStore {
    //TODO-to delete
    filesToUpload: File[]; //5
    userFiles: FileDto[];
    isLoading: boolean;
    addFiles: (files: File[]) => void;
    clearFiles: () => void;

    /*Server calls*/
    //TODO-to delete
    uploadUserFiles: (uploadOptions?: UploadOptions) => Promise<{status: UploadStatus}>; //3
    getUserFiles: (options?: QueryOptions) => Promise<FileDto[]>;
    deleteUserFile: (fileDto: FileDto) => Promise<void>;
    deleteFilesInBatch: () => void;
    //TODO-to delete
    isFileExists: (fileName: string) => Promise<FileExistsResponseDto> //4
    downloadFile: (fileHash: string) => Promise<void>
    //TODO-to delete
    selectedFile: FileDto | null; //1
    //TODO-to delete
    setSelectedFile: (file: FileDto | null) => void; //2
    selectedFileIds: number[];
    setSelectedFileIds: (fileIds: number[]) => void;
    addSelectedFileId: (fileId: number) => void;

    totalUserFiles: number;
    totalPages: number;
    validateFilesThenUpload: (newFiles: File[]) => void;
}

const useFileStore = create<FileStore>((set, get) => ({
    filesToUpload: [],
    userFiles: [],
    isLoading: false,
    uploaded: false,
    selectedFileIds: [],
    totalUserFiles: 0,
    totalPages: 0,
    //TODO-to delete
    selectedFile: null,

    addFiles: (files) => set((state) => ({filesToUpload: [...state.filesToUpload, ...files]})),
    //TODO-to delete
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
    //TODO-to delete
    uploadUserFiles: async (uploadOptions?: UploadOptions): Promise<{ status: UploadStatus }> => {
        const { filesToUpload, clearFiles } = get();
        set({ isLoading: true});

        try {
            const response = await FileService.uploadFiles(filesToUpload, uploadOptions) as FileUploadResponseDto;
            if (response?.uploadResults?.length) {
                const result = response.uploadResults[0];
                const {status, fileName, fileMetadata} = result;
                if (status != UploadStatus.SUCCESS) {
                    const description = UploadStatusDescriptions[status];
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
            NotificationService.addAlert(new AlertMessage('Ошибка при загрузке файлов', 'error'));
            set({ isLoading: false });
            return { status: UploadStatus.FAILED };
        }
    },

    getUserFiles: async (options?: QueryOptions) => {
        const opt: QueryOptions = {
            sortBy: options?.sortBy || 'id',
            sortDirection: options?.sortDirection || 'desc',
            size: options?.size || 5,
            ...options
        }
        set({isLoading: true});
        const { fileHashes, totalElements, totalPages } = await FileService.getFiles(opt);
        set({userFiles: fileHashes, totalUserFiles: totalElements, isLoading: false, totalPages: totalPages})
        return fileHashes;
    },

    deleteUserFile: async (fileDto: FileDto) => {
        const { getUserFiles } = get();
        const response = await FileService.deleteFile(fileDto.hashedFilename);

        response === 204
            ? NotificationService.addAlert(new AlertMessage(`Файл <b>${fileDto.originalFilename}</b> успешно удален`, 'success'))
            : NotificationService.addAlert(new AlertMessage(`Ошибка при удалении <b>${fileDto.originalFilename}</b>`, 'error'));

        getUserFiles();
    },
    addSelectedFileId: (fileId: number): void => {
        const currentFileIds = get().selectedFileIds;

        const newFileIds = currentFileIds.includes(fileId)
            ? currentFileIds.filter(id => id !== fileId)
            : [...currentFileIds, fileId];

        set({ selectedFileIds: newFileIds });
    },

    setSelectedFileIds: (fileIds) => {
        set({selectedFileIds: fileIds});
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
        const { selectedFileIds, getUserFiles, userFiles} = get();

        const fileHashes = userFiles
            .map(file => ({
                id: file.id,
                hash: file.hashedFilename
            }))
            .filter(fileDto => selectedFileIds.includes(fileDto.id))
            .map(fileDto => fileDto.hash);

        const response = await FileService.deleteFilesInBatch(fileHashes);
        NotificationService.deleteAlert(alert);
        response === 204
            ? NotificationService.addAlert(new AlertMessage('Файлы успешно удалены', 'success'))
            : NotificationService.addAlert(new AlertMessage('Ошибка при удалении файлов', 'error'));

        set({selectedFileIds: []});
        getUserFiles();
        set({isLoading: false})
    },
    //TODO-to delete
    setSelectedFile: async (file) => {
        set({selectedFile: file});
    },
    downloadFile: async (fileHash) => {
        await FileService.getFileByHash(fileHash);
    }
}));

export default useFileStore;
