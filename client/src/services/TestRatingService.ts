import {TestRatingDto} from "../store/tests/testStore";
import {getAxiosInstance} from "../interceptors/getAxiosInstance";
import {AxiosError} from "axios";

class TestRatingService {

    private readonly axiosInstance;

    constructor() {
        this.axiosInstance = getAxiosInstance();
    }

    upsert = async (testId: number, request: TestRatingDto) => {
        try {
            const url = `/api/v1/tests/${testId}/ratings`;
            const { status } = await this.axiosInstance.put(url, request);
            return status === 201;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    get = async (testId: number)=> {
        try {
            const url = `/api/v1/tests/${testId}/ratings`;
            const { data } = await this.axiosInstance.get(url);
            return data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }
}

export default new TestRatingService();