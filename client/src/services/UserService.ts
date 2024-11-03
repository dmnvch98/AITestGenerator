import {getAxiosInstance} from "../interceptors/getAxiosInstance";
import {AxiosError} from "axios";
import {QueryOptions} from "../store/types";

export interface BulkActivityDeleteDto {
    cids: string[];
}

class UserService {

    private readonly axiosInstance;

    constructor() {
        this.axiosInstance = getAxiosInstance();
    }

    getTestGenerationHistory = async (options?: QueryOptions) => {
        try {
            const response = await this.axiosInstance.get('/api/v1/tests/history',
                {params: options});
            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    };

    deleteCurrentUserActivities = async (dto: BulkActivityDeleteDto) => {
        try {
            const { data } = await this.axiosInstance.delete(`/api/v1/activities`,  {data: dto});
            return data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            console.log(error.message);
        }
    };
}

export default new UserService();
