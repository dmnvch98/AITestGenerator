import axios from 'axios';

const customAxios = axios.create({
    baseURL: 'http://localhost:8080', // Базовый URL вашего сервера
});

customAxios.interceptors.request.use(
    (config) => {
        if (config.url && !config.url.includes('/api/v1/auth/login')) {
            const token = localStorage.getItem("JWT");
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default customAxios;
