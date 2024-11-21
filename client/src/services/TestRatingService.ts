import {TestRatingDto} from "../store/tests/testStore";
import {getAxiosInstance} from "../interceptors/getAxiosInstance";
import {AxiosError} from "axios";

class TestRatingService {

    private readonly axiosInstance;

    constructor() {
        this.axiosInstance = getAxiosInstance();
    }

    upsert = async (testId: number, request: TestRatingDto): Promise<{success: boolean, rating?: TestRatingDto}> => {
        try {
            const url = `/api/v1/tests/${testId}/ratings`;
            const response= await this.axiosInstance.put(url, request);
            return { success: response.status === 201, rating: response?.data};
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
            return { success: false };
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