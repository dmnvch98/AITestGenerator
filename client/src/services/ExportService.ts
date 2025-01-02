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
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', testTitle);
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
