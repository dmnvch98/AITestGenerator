import customAxios from '../interceptors/custom_axios';

class AuthService {
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
}

export default new AuthService();
