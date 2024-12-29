import {getAxiosInstance} from "../interceptors/getAxiosInstance";
import {AxiosError} from "axios";
import {QueryOptions} from "../store/types";
import {FileUploadResponseDto, UploadOptions} from "../pages/files/types";

class FileService {

    private readonly axiosInstance;

    constructor() {
        this.axiosInstance = getAxiosInstance();
    }

    uploadFiles = async (files: File[], uploadOptions?: UploadOptions): Promise<FileUploadResponseDto | void> => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('file', file);
        });

        try {
            const response = await this.axiosInstance.post('/api/v1/files/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                params: uploadOptions
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке файлов:', error);
            throw error;
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

    isFileExists = async (filename: string) => {
        try {
            const response = await this.axiosInstance.get(`/api/v1/files/${filename}/exists`);
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    getFileByHash = async (fileHash: string): Promise<void> => {
        try {
            const response = await this.axiosInstance.get(`/api/v1/files/${fileHash}`, {
                responseType: 'blob',
            });

            const blob = response.data;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            const contentDisposition = response.headers['content-disposition'];

            let fileName = 'downloaded_file';

            if (contentDisposition) {
                const utf8FileNameMatch = contentDisposition.split("filename*=UTF-8''")[1];
                if (utf8FileNameMatch) {
                    fileName = decodeURIComponent(utf8FileNameMatch.split(';')[0].trim());
                } else {
                    const asciiFileNameMatch = contentDisposition.split('filename="')[1];
                    if (asciiFileNameMatch) {
                        fileName = asciiFileNameMatch.split('"')[0];
                    } else {
                        console.warn('Не удалось извлечь имя файла из заголовка Content-Disposition');
                    }
                }
            } else {
                console.warn('Заголовок Content-Disposition отсутствует');
            }

            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.error('Ошибка при загрузке файла:', error.message);
        }
    };

}

export default new FileService();
