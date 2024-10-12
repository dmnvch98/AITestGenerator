// customAxios.ts
import axios from 'axios';

const createCustomAxios = (logout: () => Promise<void>, refresh: () => Promise<void>) => {
    const customAxios = axios.create({
        baseURL: `http://localhost:8080`,
        withCredentials: true,
    });

    let refreshTokenPromise: Promise<any> | null = null;

    // Интерсептор запросов
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
        async error => {
            const originalRequest = error.config;

            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                console.log('Token expired, trying to refresh...');

                if (!refreshTokenPromise) {
                    refreshTokenPromise = refresh()
                        .then(() => {
                            refreshTokenPromise = null;
                            originalRequest._retry = true;
                            console.log('Token refreshed successfully');
                            return customAxios(originalRequest);
                        })
                        .catch(async (err: any) => {
                            console.error('Refresh token failed, logging out:', err);
                            refreshTokenPromise = null;
                            await logout();
                            return Promise.reject(err);
                        });
                }

                return refreshTokenPromise;
            }

            return Promise.reject(error);
        }
    );

    return customAxios;
};

export default createCustomAxios;
