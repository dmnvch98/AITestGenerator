import { AxiosInstance } from 'axios';
import createCustomAxios from "./custom_axios";

let axiosInstance: AxiosInstance;

const createAxiosInstance = () => {
    return createCustomAxios;
};

export const getAxiosInstance = () => {
    if (!axiosInstance) {
        axiosInstance = createAxiosInstance();
    }
    return axiosInstance;
};

export default getAxiosInstance;
