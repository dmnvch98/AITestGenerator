import getAxiosInstance from "../../interceptors/getAxiosInstance";
import {IncidentExistsResponseDto} from "../activities/types";

class IncidentService {

    private readonly axiosInstance;

    constructor() {
        this.axiosInstance = getAxiosInstance();
    }

    public isIncidentExists = async (): Promise<IncidentExistsResponseDto> => {
        try {
            const response = await this.axiosInstance.get('/api/v1/incidents');
            return response.data;
        } catch (error) {
            console.error("Не удалось получить данные об инциденте", error);
            return { exists: false };
        }
    };

}

export default new IncidentService();