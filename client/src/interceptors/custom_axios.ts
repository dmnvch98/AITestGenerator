import axios from 'axios';
import { AuthService } from '../services/AuthService';

const customAxios = axios.create({
    baseURL: 'http://localhost:8080',
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

customAxios.interceptors.response.use(r => r, error => {
  if (error.config && error.response && error.response.status === 401) {

    if (!refreshTokenPromise) {
      const authService: AuthService = new AuthService();
      refreshTokenPromise = authService.refresh().then((r) => {
        refreshTokenPromise = null //
        localStorage.setItem("JWT", r.data.accessToken);
      })
    }

    return refreshTokenPromise.then(() => {
      return customAxios.request(error.config)
    })
  }
  return Promise.reject(error)
})

export default customAxios;
