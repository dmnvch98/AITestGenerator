import axiosInstance from "../../interceptors/axiosInstance";

class ActivityService {

    public longPolling = async () => {
        try {
            return await axiosInstance.get('api/v1/activities/long-poll');
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
}

export default new ActivityService();