import { getAxiosInstance } from "../interceptors/getAxiosInstance";

class AuthService {

  private readonly axiosInstance;

  constructor() {
    this.axiosInstance = getAxiosInstance();
  }

  signup = async (email: string, password: string) => {
    return await this.axiosInstance.post(`/api/v1/users`, { email, password });
  };

  login = async (email: string, password: string) => {
    return await this.axiosInstance.post('/api/v1/auth/login', {
      email,
      password,
      role: "USER"
    });
  };

  logout = async () => {
    await this.axiosInstance.post('/api/v1/auth/logout');
  };

  refresh = async () => {
    return await this.axiosInstance.post('/api/v1/auth/refresh');
  };

}

export default new AuthService();
