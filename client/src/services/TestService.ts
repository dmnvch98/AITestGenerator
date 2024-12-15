import {getAxiosInstance} from "../interceptors/getAxiosInstance";
import {AxiosError} from "axios";
import {
    BulkDeleteTestsRequestDto,
    CreateTestRequestDto,
    TestPrintRequestDto,
    UserTest
} from "../store/tests/testStore";
import {QueryOptions} from "../store/types";
import {GenerateTestRequest} from "../store/tests/types";

class TestService {

    private readonly axiosInstance;

    constructor() {
        this.axiosInstance = getAxiosInstance();
    }

    saveUserTest = async (dto: CreateTestRequestDto) => {
        try {
            const response = await this.axiosInstance.post("/api/v1/tests", dto);
            return response.status === 201;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    generateTestByFile = async (request: GenerateTestRequest) => {
        try {
            const response = await this.axiosInstance.post(`/api/v1/tests/generate`, request);
            return response.status == 200;
        } catch (e: unknown) {
            return false;
        }
    }

    getUserTests = async (options?: QueryOptions) => {
        try {
            const url = "/api/v1/tests";
            const response = await this.axiosInstance.get(url, {params: options});
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    deleteTest = async (id: number) => {
        try {
            const response = await this.axiosInstance.delete("/api/v1/tests/" + id);
            return response.status == 204;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    bulkTestDelete = async (requestDto: BulkDeleteTestsRequestDto) => {
        try {
            const response = await this.axiosInstance.delete("/api/v1/tests", {data: requestDto});
            return response.status == 204;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    upsert = async (test: UserTest | CreateTestRequestDto) => {
        try {
            const response = await this.axiosInstance.put("/api/v1/tests", test);
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    getCurrentTestGenActivities = async () => {
        try {
            const { data } = await this.axiosInstance.get(`/api/v1/activities`);
            return data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }


    getUserTestById = async (id: number) => {
        try {
            const url = `/api/v1/tests/${id}`;
            const response = await this.axiosInstance.get(url);
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    printTest = async (dto: TestPrintRequestDto) => {
        try {
            const url = '/api/v1/tests/print';
            const response = await this.axiosInstance.post(url, dto);
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

}

export default new TestService();
