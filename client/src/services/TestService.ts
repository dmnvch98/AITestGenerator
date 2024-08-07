import customAxios from "../interceptors/custom_axios";
import {AxiosError} from "axios";
import {GenerateTestRequestDto, UserTest} from "../store/tests/testStore";
import {GenerationStatus} from "../store/types";

class TestService {
    generateTest = async (dto: GenerateTestRequestDto) => {
        try {
            const response = await customAxios.post("/api/v1/tests/generate", dto);
            return response.status == 200;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    generateTestByFile = async (hashedFileName: string) => {
        try {
            const response = await customAxios.post(`/api/v1/tests/generate/files/${hashedFileName}`);
            return response.status == 200;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    getUserTests = async (ids?: number[]) => {
        try {
            const url = "/api/v1/tests";
            const params = ids ? {ids: ids.join(",")} : undefined;
            const response = await customAxios.get(url, {params});
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    deleteTest = async (id: number) => {
        try {
            const response = await customAxios.delete("/api/v1/tests/" + id);
            return response.status == 204;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    updateTest = async (test: UserTest) => {
        try {
            const response = await customAxios.put("/api/v1/tests", test);
            return response.status == 200;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    getCurrentTestGenerationHistory = async () => {
        try {
            const response = await customAxios.get(`/api/v1/tests/history/current`);
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

}

export default new TestService();
