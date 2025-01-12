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

export interface UploadGenerateStore {
    selectedFile: FileDto | null;
    filesToUpload: File[];
    isUploading: boolean;
    isGenerationQueueing: boolean;

    setSelectedFile: (file: FileDto) => void;
    uploadUserFiles: (uploadOptions?: UploadOptions) => Promise<{status: UploadStatus}>;
    isFileExists: (fileName: string) => Promise<FileExistsResponseDto>
    generateTestByFile: (request: GenerateTestRequest) => Promise<boolean>,
}

const useUploadGenerateStore = create<UploadGenerateStore>((set, get) => ({
    selectedFile: null,
    filesToUpload: [],
    isUploading: false,
    isGenerationQueueing: false,

    setSelectedFile: async (file) => {
        set({selectedFile: file});
    },
    uploadUserFiles: async (uploadOptions?: UploadOptions): Promise<{ status: UploadStatus }> => {
        const { filesToUpload } = get();
        set({ isUploading: true});

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
                    set({selectedFile: fileMetadata, filesToUpload: []});
                }
                set({isUploading: false});
                return {status};
            }

            return { status: UploadStatus.FAILED };
        } catch (error) {
            NotificationService.addAlert(new AlertMessage('Ошибка при загрузке файлов', 'error'));
            set({ isUploading: false });
            return { status: UploadStatus.FAILED };
        }
    },
    isFileExists: async (fileName: string): Promise<FileExistsResponseDto> => {
        set({isUploading: true});
        const result = await FileService.isFileExists(fileName);
        set({isUploading: false});

        return result;
    },
    generateTestByFile: async (request): Promise<boolean> => {
        const { selectedFile } = get();
        if (selectedFile) {
            const params = Object.entries(selection)
                .filter(([_, value]) => value.selected)
                .map(([key, value]) => ({
                    questionType: key as unknown as QuestionType,
                    maxQuestions: value.maxQuestions,
                }));

            const request: GenerateTestRequest = {
                hashedFileName: selectedFile.hashedFilename,
                originalFileName: selectedFile.originalFilename,
                params: params,
            };

            const isSuccess = await generateTestByFile(request);
        }
        return await TestService.generateTestByFile(request);
    }

}));

export default useUploadGenerateStore;