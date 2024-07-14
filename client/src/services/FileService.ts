import customAxios from "../interceptors/custom_axios";
import {AxiosError} from "axios";

class FileService {

    uploadFiles = async (files: File[]) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('file', file);
        });
        try {
            const response = await customAxios.post('/api/v1/files/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            response.status === 201 && console.log('Файлы успешно загружены:', response.data);
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
}

export default new FileService();
