import customAxios from "../interceptors/custom_axios";
import {AxiosError} from "axios";

class UserService {
    getTestGenerationHistory = async () => {
        try {
            const response = await customAxios.get("http://localhost:8080/api/v1/users/test-gen-history");
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }
}

export default new UserService();