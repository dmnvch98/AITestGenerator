import axiosInstance from "../interceptors/axiosInstance";
import {AxiosError} from "axios";
import {GenerationStatus} from "../store/types";

class UserService {

    getTestGenerationHistory = async (status: GenerationStatus | undefined) => {
        try {
            const queryParam = status ? `status=${status}` : '';
            const response = await axiosInstance.get(`/api/v1/tests/history?${queryParam}`);
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    getMe = async () => {
        try {
            const response = await axiosInstance.get(`/api/v1/users/me`);
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }
}

export default new UserService();
