import {AxiosError} from "axios";
import customAxios from "../interceptors/custom_axios";
import {UserText} from "../store/textStore";

class TextService {
    getAllUserTexts = async () => {
        try {
            const response = await customAxios.get("http://localhost:8080/api/v1/texts");
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    getUserTextsByIdsIn = async (ids: number[]) => {
        try {
            const response = await customAxios.get("http://localhost:8080/api/v1/texts", {
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
            const response = await customAxios.post("http://localhost:8080/api/v1/texts", text);
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    deleteText = async (id: number) => {
        try {
            const response = await customAxios.delete("http://localhost:8080/api/v1/texts/" + id);
            return response.status == 204;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    deleteInBatch = async (ids: number[]) => {
        try {
            const response = await customAxios.patch("http://localhost:8080/api/v1/texts/", ids);
            return response.status == 204;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    updateText = async (text: UserText) => {
        try {
            const response = await customAxios.put("http://localhost:8080/api/v1/texts/", text);
            return response.data
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }
}

export default new TextService();