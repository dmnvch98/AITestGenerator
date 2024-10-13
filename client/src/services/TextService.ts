import {AxiosError} from "axios";
import {getAxiosInstance} from "../interceptors/getAxiosInstance";
import {UserText} from "../store/textStore";

class TextService {

    private readonly axiosInstance;

    constructor() {
        this.axiosInstance = getAxiosInstance();
    }

    getAllUserTexts = async () => {
        try {
            const response = await this.axiosInstance.get("/api/v1/texts/");
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    getUserTextsByIdsIn = async (ids: number[]) => {
        try {
            const response = await this.axiosInstance.get("/api/v1/texts/", {
                params: {ids: ids.join(',')}
            });
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    saveText = async (text: UserText) => {
        try {
            const response = await this.axiosInstance.post("/api/v1/texts/", text);
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    deleteText = async (id: number) => {
        try {
            const response = await this.axiosInstance.delete("/api/v1/texts/" + id);
            return response.status == 204;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    deleteInBatch = async (ids: number[]) => {
        try {
            const response = await this.axiosInstance.patch("/api/v1/texts/", ids);
            return response.status == 204;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    updateText = async (text: UserText) => {
        try {
            const response = await this.axiosInstance.put("/api/v1/texts/", text);
            return response.data
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }
}

export default new TextService();
