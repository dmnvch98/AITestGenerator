import axiosInstance from "../interceptors/axiosInstance";

class AuthService {
  signup = async (email: string, password: string) => {
    return await axiosInstance.post(`/api/v1/users`, { email, password });
  };

  login = async (email: string, password: string) => {
    return await axiosInstance.post('/api/v1/auth/login', {
      email,
      password,
      role: "USER"
    });
  };

  logout = async () => {
    await axiosInstance.post('/api/v1/auth/logout');
  };

  refresh = async () => {
    return await axiosInstance.post('/api/v1/auth/refresh');
  }
}

export default new AuthService();