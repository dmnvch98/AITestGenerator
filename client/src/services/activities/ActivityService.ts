import {getAxiosInstance} from "../../interceptors/getAxiosInstance";

class ActivityService {

    private readonly axiosInstance;

    constructor() {
        this.axiosInstance = getAxiosInstance();
    }

    public longPolling = async () => {
        try {
            return await this.axiosInstance.get('api/v1/activities/long-poll');
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
}

export default new ActivityService();