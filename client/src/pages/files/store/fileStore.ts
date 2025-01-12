import { create } from 'zustand';
import FileService from '../../../services/FileService';
import {AlertMessage, QueryOptions} from "../../../store/types";
import NotificationService from "../../../services/notification/AlertService";
import {
    FileDto,
} from "../types";

interface FileStore {
    userFiles: FileDto[];
    isLoading: boolean;

    /*Server calls*/
    getUserFiles: (options?: QueryOptions) => Promise<FileDto[]>;
    deleteUserFile: (fileDto: FileDto) => Promise<void>;
    deleteFilesInBatch: () => void;
    downloadFile: (fileHash: string) => Promise<void>
    selectedFileIds: number[];
    setSelectedFileIds: (fileIds: number[]) => void;
    addSelectedFileId: (fileId: number) => void;

    totalUserFiles: number;
    totalPages: number;
}

const useFileStore = create<FileStore>((set, get) => ({
    filesToUpload: [],
    userFiles: [],
    isLoading: false,
    uploaded: false,
    selectedFileIds: [],
    totalUserFiles: 0,
    totalPages: 0,

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
        set({isLoading: true})
        const { getUserFiles } = get();
        const response = await FileService.deleteFile(fileDto.hashedFilename);

        response === 204
            ? NotificationService.addAlert(new AlertMessage(`Файл <b>${fileDto.originalFilename}</b> успешно удален`, 'success'))
            : NotificationService.addAlert(new AlertMessage(`Ошибка при удалении <b>${fileDto.originalFilename}</b>`, 'error'));

        getUserFiles();
        set({isLoading: false})
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
        const { selectedFileIds, getUserFiles, userFiles} = get();

        const fileHashes = userFiles
            .map(file => ({
                id: file.id,
                hash: file.hashedFilename
            }))
            .filter(fileDto => selectedFileIds.includes(fileDto.id))
            .map(fileDto => fileDto.hash);

        const response = await FileService.deleteFilesInBatch(fileHashes);
        response === 204
            ? NotificationService.addAlert(new AlertMessage('Файлы успешно удалены', 'success'))
            : NotificationService.addAlert(new AlertMessage('Ошибка при удалении файлов', 'error'));

        set({selectedFileIds: []});
        getUserFiles();
        set({isLoading: false})
    },
    downloadFile: async (fileHash) => {
        await FileService.getFileByHash(fileHash);
    }
}));

export default useFileStore;
