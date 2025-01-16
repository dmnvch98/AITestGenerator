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

const FILE_UPLOAD_LIMIT_MB = 5;

export interface UploadGenerateStore {
    selectedFile: FileDto | null;
    filesToUpload: File[];
    uploadEnabled: boolean;
    isUploading: boolean;
    isGenerationQueueing: boolean;
    selection: Record<QuestionType, SelectionItem>;
    fileUploadModal: boolean;
    activeStep: number;
    fileUploadActiveTab: number;

    setSelectedFile: (file: FileDto) => void;
    setSelection: (selection: Record<QuestionType, SelectionItem>) => void;
    addFilesToUpload: (files: File[]) => void;
    removeFileFromUpload: (file: File) => void;
    clearFilesToUpload: () => void;
    validateUserFile: (file: File) => Promise<{ error?: string, success: boolean }>;
    validateAndUploadUserFile: (uploadOptions?: UploadOptions) => Promise<void>;
    upload: (uploadOptions?: UploadOptions) => Promise<{uploadError?: string}>;
    confirmUpload: (uploadOptions?: UploadOptions) => Promise<void>;
    isFileExists: (fileName: string) => Promise<FileExistsResponseDto>;
    generateTestByFile: () => Promise<boolean>;
    setActiveStep: (step: number) => void;
    setFileUploadActiveTab: (tabNumber: number) => void;
}

const useUploadGenerateStore = create<UploadGenerateStore>((set, get) => ({
    activeStep: 0,
    fileUploadActiveTab: 0,
    selectedFile: null,
    filesToUpload: [],
    uploadEnabled: false,
    isUploading: false,
    isGenerationQueueing: false,
    fileUploadModal: false,
    selection: Object.keys(QuestionType).reduce((acc, key) => {
        acc[key as QuestionType] = {selected: false, maxQuestions: 10};
        return acc;
    }, {} as Record<QuestionType, SelectionItem>),

    setSelectedFile: (file) => {
        set({ selectedFile: file, uploadEnabled: true });
    },
    setSelection: (selection) => {
        set({ selection });
    },
    addFilesToUpload: (files) => {
        set((state) => ({ filesToUpload: [...state.filesToUpload, ...files], uploadEnabled: true, selectedFile: null }));
    },
    removeFileFromUpload: (file) => {
        set((state) => ({
            filesToUpload: state.filesToUpload.filter((f) => f !== file)
        }));
    },
    clearFilesToUpload: () => {
        set({filesToUpload: []});
    },
    validateAndUploadUserFile: async () => {
        set({isUploading: true});
        const {filesToUpload, validateUserFile, upload, activeStep } = get();

        const {error, success} = await validateUserFile(filesToUpload[0]);

        if (error) {
            NotificationService.addAlert(new AlertMessage(error, 'error'));
            return;
        }

        if (!success) {
            return;
        }
        const { uploadError } = await upload();

        if (uploadError) {
            NotificationService.addAlert(new AlertMessage(uploadError, 'error'));
        }

        set({isUploading: false, activeStep: activeStep + 1});
    },
    validateUserFile: async (file: File): Promise<{ error?: string, success: boolean }> => {
        if (!file) {
            return {error: 'Нет файлов для загрузки.', success: false};
        }

        const maxSizeInBytes = FILE_UPLOAD_LIMIT_MB * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
            return {error: `Размер файла превышает ${FILE_UPLOAD_LIMIT_MB} МБ.`, success: false};
        }

        const {exists} = await FileService.isFileExists(file.name);
        if (exists) {
            set({fileUploadModal: true});
            return {success: false};
        }

        return {success: true};
    },
    upload: async (uploadOptions?: UploadOptions): Promise<{ uploadError?: string }> => {
        const {filesToUpload} = get();
        try {
            const response = (await FileService.uploadFiles(filesToUpload, uploadOptions)) as FileUploadResponseDto;
            if (response?.uploadResults?.length) {
                const result = response.uploadResults[0];
                const {status, fileName, fileMetadata} = result;
                if (status == UploadStatus.SUCCESS) {
                    set({selectedFile: fileMetadata, filesToUpload: []});
                    return {};
                } else {
                    const description = UploadStatusDescriptions[status];
                    return {uploadError: `${description} - <b>${fileName}</b>`};
                }
            }
            return {uploadError: 'Не удалось загрузить файл'};
        } catch (error) {
            return {uploadError: 'Ошибка при загрузке файлов'};
        }
    },
    confirmUpload: async (uploadOptions?: UploadOptions) => {
        const {upload, activeStep} = get();

        set({fileUploadModal: false, isUploading: true});

        const { uploadError } = await upload(uploadOptions);

        if (uploadError) {
            NotificationService.addAlert(new AlertMessage(uploadError, 'error'));
        }

        set({isUploading: false, activeStep: activeStep + 1});
    },
    isFileExists: async (fileName: string): Promise<FileExistsResponseDto> => {
        return await FileService.isFileExists(fileName);
    },
    generateTestByFile: async (): Promise<boolean> => {
        const {selectedFile, selection} = get();
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

        set({isGenerationQueueing: true});

        try {
            const isSuccess = await TestService.generateTestByFile(request);
            if (isSuccess) {
                setTimeout(() => {
                    NotificationService.addAlert(new AlertMessage('Генерация скоро начнется', 'success'));
                }, 600);
            } else {
                NotificationService.addAlert(new AlertMessage(`Ошибка генерации для <b>${request.originalFileName}</b>.<br/>Пожалуйста, попробуйте позже.`, 'error'));
            }
            return isSuccess;
        } catch (error) {
            NotificationService.addAlert(new AlertMessage('Ошибка при генерации теста', 'error'));
            return false;
        } finally {
            set({isGenerationQueueing: false});
        }
    },
    setActiveStep: (step) => {
        set({activeStep: step});
    },
    setFileUploadActiveTab: (tab) => {
        set({fileUploadActiveTab: tab});
    }
}));

export default useUploadGenerateStore;
