import { getAxiosInstance } from "../interceptors/getAxiosInstance";

class AuthService {

  private readonly axiosInstance;

  constructor() {
    this.axiosInstance = getAxiosInstance();
  }

  signup = async (email: string, password: string) => {
    return await this.axiosInstance.post(`/api/v1/users/sign-up`, { email, password });
  };

  login = async (email: string, password: string): Promise<{ success: boolean; message?: string, jwt?: string }> => {
    try {
      const result = await this.axiosInstance.post('/api/v1/auth/login', {
        email,
        password,
      });

      if (result.status === 200) {
        return { success: true, jwt: result.data.accessToken };
      }

      return { success: false, message: 'Произошла ошибка во время логина. Пожалуйста, попробуйте позже'};
    } catch (e: any) {
      if (e.response?.status === 404) {
        return { success: false, message: 'Пользователь не найден' };
      }
      return { success: false, message: 'Произошла ошибка во время логина. Пожалуйста, попробуйте позже' };
    }
  };


  logout = async () => {
    await this.axiosInstance.post('/api/v1/auth/logout');
  };

  refresh = async () => {
    return await this.axiosInstance.post('/api/v1/auth/refresh');
  };

}

export default new AuthService();
