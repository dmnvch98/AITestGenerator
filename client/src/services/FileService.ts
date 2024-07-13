import customAxios from "../interceptors/custom_axios";

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
}

export default new FileService();
