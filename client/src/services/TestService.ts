import customAxios from "../interceptors/custom_axios";
import {AxiosError} from "axios";
import {
    BulkDeleteTestsRequestDto,
    CreateTestRequestDto,
    GenerateTestRequest,
    GenerateTestRequestDto,
    UserTest
} from "../store/tests/testStore";

class TestService {

    saveUserTest = async (dto: CreateTestRequestDto) => {
        try {
            const response = await customAxios.post("/api/v1/tests", dto);
            return response.status === 201;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    generateTest = async (dto: GenerateTestRequestDto) => {
        try {
            const response = await customAxios.post("/api/v1/tests/generate", dto);
            return response.status == 200;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    generateTestByFile = async (request: GenerateTestRequest) => {
        try {
            const response = await customAxios.post(`/api/v1/tests/generate`, request);
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

    bulkTestDelete = async (requestDto: BulkDeleteTestsRequestDto) => {
        try {
            const response = await customAxios.delete("/api/v1/tests", {data: requestDto});
            return response.status == 204;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    upsert = async (test: UserTest | CreateTestRequestDto) => {
        try {
            console.log(test);
            const response = await customAxios.put("/api/v1/tests", test);
            return response.data;
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


    getUserTestById = async (id: number) => {
        try {
            const url = `/api/v1/tests/${id}`;
            const response = await customAxios.get(url);
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

}

export default new TestService();
