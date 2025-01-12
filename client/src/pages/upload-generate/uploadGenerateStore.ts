// uploadGenerateStore.ts
import {
    FileDto,
    FileExistsResponseDto,
    FileUploadResponseDto,
    UploadOptions,
    UploadStatus,
    UploadStatusDescriptions
} from "../files/types";
import {GenerateTestRequest, QuestionType} from "../../store/tests/types";
import {create} from "zustand";
import FileService from "../../services/FileService";
import {AlertMessage} from "../../store/types";
import NotificationService from "../../services/notification/AlertService";
import TestService from "../../services/TestService";

export interface SelectionItem {
    selected: boolean;
    maxQuestions: number;
}

export interface UploadGenerateStore {
    selectedFile: FileDto | null;
    filesToUpload: File[];
    uploadEnabled: boolean;
    isUploading: boolean;
    isGenerationQueueing: boolean;
    selection: Record<QuestionType, SelectionItem>;

    setSelectedFile: (file: FileDto) => void;
    setSelection: (selection: Record<QuestionType, SelectionItem>) => void;
    addFilesToUpload: (files: File[]) => void;
    removeFileFromUpload: (file: File) => void;
    clearFilesToUpload: () => void;
    uploadUserFiles: (uploadOptions?: UploadOptions) => Promise<{ status: UploadStatus; needsConfirmation?: boolean }>;
    confirmUpload: (uploadOptions?: UploadOptions) => Promise<UploadStatus>;
    isFileExists: (fileName: string) => Promise<FileExistsResponseDto>;
    generateTestByFile: () => Promise<boolean>;
}

const useUploadGenerateStore = create<UploadGenerateStore>((set, get) => ({
    selectedFile: null,
    filesToUpload: [],
    uploadEnabled: false,
    isUploading: false,
    isGenerationQueueing: false,
    selection: Object.keys(QuestionType).reduce((acc, key) => {
        acc[key as QuestionType] = { selected: false, maxQuestions: 10 };
        return acc;
    }, {} as Record<QuestionType, SelectionItem>),

    setSelectedFile: (file) => {
        set({ selectedFile: file, uploadEnabled: true });
    },
    setSelection: (selection) => {
        set({ selection });
    },
    addFilesToUpload: (files) => {
        set((state) => ({ filesToUpload: [...state.filesToUpload, ...files], uploadEnabled: true }));
    },
    removeFileFromUpload: (file) => {
        set((state) => ({
            filesToUpload: state.filesToUpload.filter((f) => f !== file)
        }));
    },
    clearFilesToUpload: () => {
        const { selectedFile } = get();
        set({ filesToUpload: [], uploadEnabled: Boolean(selectedFile) });
    },
    uploadUserFiles: async (uploadOptions?: UploadOptions): Promise<{ status: UploadStatus; }> => {
        set({ isUploading: true });
        const { filesToUpload } = get();
        if (filesToUpload.length === 0) {
            NotificationService.addAlert(new AlertMessage('Нет файлов для загрузки.', 'error'));
            return { status: UploadStatus.FAILED };
        }

        const fileName = filesToUpload[0].name;
        const existenceResponse = await FileService.isFileExists(fileName);

        if (existenceResponse.exists) {
            return { status: UploadStatus.ALREADY_UPLOADED };
        }

        try {
            const response = (await FileService.uploadFiles(filesToUpload, uploadOptions)) as FileUploadResponseDto;
            if (response?.uploadResults?.length) {
                const result = response.uploadResults[0];
                const { status, fileName, fileMetadata } = result;
                if (status !== UploadStatus.SUCCESS) {
                    const description = UploadStatusDescriptions[status];
                    const message = `${description} - <b>${fileName}</b>`;
                    NotificationService.addAlert(new AlertMessage(message, 'error'));
                } else {
                    set({ selectedFile: fileMetadata, filesToUpload: [] });
                }
                return { status };
            }

            return { status: UploadStatus.FAILED };
        } catch (error) {
            NotificationService.addAlert(new AlertMessage('Ошибка при загрузке файлов', 'error'));
            return { status: UploadStatus.FAILED };
        } finally {
            set({ isUploading: false });
        }
    },
    confirmUpload: async (uploadOptions?: UploadOptions): Promise<UploadStatus> => {
        const { filesToUpload } = get();
        set({ isUploading: true });

        try {
            const response = (await FileService.uploadFiles(filesToUpload, uploadOptions)) as FileUploadResponseDto;
            if (response?.uploadResults?.length) {
                const result = response.uploadResults[0];
                const { status, fileName, fileMetadata } = result;
                if (status !== UploadStatus.SUCCESS) {
                    const description = UploadStatusDescriptions[status];
                    const message = `${description} - <b>${fileName}</b>`;
                    NotificationService.addAlert(new AlertMessage(message, 'error'));
                } else {
                    set({ selectedFile: fileMetadata, filesToUpload: [] });
                }
                return status;
            }

            return UploadStatus.FAILED;
        } catch (error) {
            NotificationService.addAlert(new AlertMessage('Ошибка при загрузке файлов', 'error'));
            return UploadStatus.FAILED;
        } finally {
            set({ isUploading: false });
        }
    },
    isFileExists: async (fileName: string): Promise<FileExistsResponseDto> => {
        return await FileService.isFileExists(fileName);
    },
    generateTestByFile: async (): Promise<boolean> => {
        const { selectedFile, selection } = get();
        if (!selectedFile) {
            NotificationService.addAlert(new AlertMessage('Файл не выбран для генерации теста.', 'error'));
            return false;
        }

        const params = Object.entries(selection)
            .filter(([_, value]) => value.selected)
            .map(([key, value]) => ({
                questionType: key as QuestionType,
                maxQuestions: value.maxQuestions,
            }));

        if (params.length === 0) {
            NotificationService.addAlert(new AlertMessage('Не выбраны параметры генерации.', 'error'));
            return false;
        }

        const request: GenerateTestRequest = {
            hashedFileName: selectedFile.hashedFilename,
            originalFileName: selectedFile.originalFilename,
            params: params,
        };

        set({ isGenerationQueueing: true });

        try {
            const isSuccess = await TestService.generateTestByFile(request);
            if (isSuccess) {
                NotificationService.addAlert(new AlertMessage('Генерация скоро начнется', 'success'));
            } else {
                NotificationService.addAlert(new AlertMessage(`Ошибка генерации для <b>${request.originalFileName}</b>.<br/>Пожалуйста, попробуйте позже.`, 'error'));
            }
            return isSuccess;
        } catch (error) {
            NotificationService.addAlert(new AlertMessage('Ошибка при генерации теста', 'error'));
            return false;
        } finally {
            set({ isGenerationQueueing: false });
        }
    }
}));

export default useUploadGenerateStore;
