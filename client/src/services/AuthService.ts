import customAxios from '../interceptors/custom_axios';

export class AuthService {
  signup = async (email: string, password: string) => {
    return await customAxios.post(`/api/v1/users`, { email, password });
  };

  login = async (email: string, password: string) => {
    return await customAxios.post('/api/v1/auth/login', {
      email,
      password,
      role: "USER"
    });
  };

  logout = async () => {
    localStorage.removeItem("JWT");
    await customAxios.post('/api/v1/auth/logout');
  };

  refresh = async () => {
    return await customAxios.post('/api/v1/auth/refresh');
  }
}
