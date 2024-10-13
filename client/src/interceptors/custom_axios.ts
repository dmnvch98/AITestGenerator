import axios from 'axios';
import AuthService from "../services/AuthService";

const profile = process.env.REACT_APP_PROFILE;
const host = profile === 'demo' ? 'server' : 'localhost';

const customAxios = axios.create({
    baseURL: `http://${host}:8080`,
    withCredentials: true
});

let refreshTokenPromise: any

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

customAxios.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (!refreshTokenPromise) {
                refreshTokenPromise = AuthService.refresh()
                    .then((r: { data: { accessToken: string; }; }) => {
                        refreshTokenPromise = null;
                        localStorage.setItem("JWT", r.data.accessToken);
                        originalRequest._retry = true;
                        return customAxios(originalRequest);
                    })
                    .catch((err: any) => {
                        refreshTokenPromise = null;
                        localStorage.removeItem("JWT");
                        window.location.href = '/sign-in';
                        return Promise.reject(err);
                    });
            }

            return refreshTokenPromise;
        }

        return Promise.reject(error);
    }
);

export default customAxios;
