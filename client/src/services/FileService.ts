import customAxios from "../interceptors/custom_axios";
import {AxiosError} from "axios";
import {FileUploadResponseDto} from "../store/fileStore";

class FileService {

    uploadFiles = async (files: File[]): Promise<FileUploadResponseDto | void> => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('file', file);
        });
        try {
            const response =  await customAxios.post('/api/v1/files/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке файлов:', error);
        }
    };

    getFiles = async () => {
        try {
            const response = await customAxios.get(`/api/v1/files/`);
            return response.data.fileHashes;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    deleteFile = async (hashedFileName: string) => {
        try {
            const response = await customAxios.delete(`/api/v1/files/${hashedFileName}`);
            return response.status;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    deleteFilesInBatch = async (hashesFileNames: string[]) => {
        try {
            const response = await customAxios.post('/api/v1/files/delete', hashesFileNames);
            return response.status;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }
}

export default new FileService();
