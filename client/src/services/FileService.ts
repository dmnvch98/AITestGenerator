import {getAxiosInstance} from "../interceptors/getAxiosInstance";
import {AxiosError} from "axios";
import {FileUploadResponseDto} from "../pages/files/store/fileStore";
import {QueryOptions} from "../store/types";

class FileService {

    private readonly axiosInstance;

    constructor() {
        this.axiosInstance = getAxiosInstance();
    }

    uploadFiles = async (files: File[]): Promise<FileUploadResponseDto | void> => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('file', file);
        });
        try {
            const response =  await this.axiosInstance.post('/api/v1/files/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке файлов:', error);
        }
    };

    getFiles = async (options?: QueryOptions) => {
        try {
            const response = await this.axiosInstance.get('/api/v1/files/filter', {params: options});
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    deleteFile = async (hashedFileName: string) => {
        try {
            const response = await this.axiosInstance.delete(`/api/v1/files/${hashedFileName}`);
            return response.status;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    deleteFilesInBatch = async (hashesFileNames: string[]) => {
        try {
            const response = await this.axiosInstance.post('/api/v1/files/delete', hashesFileNames);
            return response.status;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }
}

export default new FileService();
