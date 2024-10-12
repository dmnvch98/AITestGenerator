import {TestRatingDto} from "../store/tests/testStore";
import axiosInstance from "../interceptors/axiosInstance";
import {AxiosError} from "axios";

class TestRatingService {

    upsert = async (testId: number, request: TestRatingDto) => {
        try {
            const url = `/api/v1/tests/${testId}/ratings`;
            const { status } = await axiosInstance.put(url, request);
            return status === 201;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }

    get = async (testId: number)=> {
        try {
            const url = `/api/v1/tests/${testId}/ratings`;
            const { data } = await axiosInstance.get(url);
            return data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    }
}

export default new TestRatingService();