import {getAxiosInstance} from "../interceptors/getAxiosInstance";
import {AxiosError} from "axios";
import {GenerationStatus} from "../store/types";

class UserService {

    private readonly axiosInstance;

    constructor() {
        this.axiosInstance = getAxiosInstance();
    }

    getTestGenerationHistory = async (status: GenerationStatus | undefined) => {
        try {
            const queryParam = status ? `status=${status}` : '';
            const response = await this.axiosInstance.get(`/api/v1/tests/history?${queryParam}`);
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    isAuthenticated = async () => {
        try {
            const response = await this.axiosInstance.get(`/api/v1/users/me`);
            return response.status == 200;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
            return false;
        }
    }
}

export default new UserService();
