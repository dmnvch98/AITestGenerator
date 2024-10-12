import { useAuthStore } from '../pages/auth/authStore';
import createCustomAxios from "./custom_axios";

const createAxiosInstance = () => {
    const { logout, refresh } = useAuthStore.getState();
    return createCustomAxios(logout, refresh);
};

const axiosInstance = createAxiosInstance();

export default axiosInstance;
