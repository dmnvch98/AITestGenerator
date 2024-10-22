import {getAxiosInstance} from "../interceptors/getAxiosInstance";
import {ExportTestRequestDto} from "../store/tests/exportStore";

class ExportService {

    private readonly axiosInstance;

    constructor() {
        this.axiosInstance = getAxiosInstance();
    }

    exportTest = async (dto: ExportTestRequestDto, testId: number, testTitle: string) => {
        try {
            const { data } = await this.axiosInstance({
                url: `/api/v1/tests/${testId}/export`,
                method: 'POST',
                data: dto,
                responseType: 'blob', // Обработка бинарных данных
            });

            // Нормализуем название теста и формируем имя файла
            // const normalizedTitle = testTitle.slice(0, 100).replace(" ", "_");
            // const filename = `${normalizedTitle}.${dto.exportFormat.toLowerCase()}`;

            // Создаем и вызываем ссылку для скачивания файла
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', testTitle); // Используем имя файла на основе формата
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error('Error in downloading the file:', e);
        }
    }
}

export default new ExportService();
