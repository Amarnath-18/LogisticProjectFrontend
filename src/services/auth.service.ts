import { api } from './api';
import { User, LoginRequest, RegisterRequest } from '../types';
import Cookies from 'js-cookie';

export const authService = {
  register: async (data: RegisterRequest): Promise<{ user: User }> => {
    const response = await api.post('/Auth/register', data);
    Cookies.set("token", "abcd1234", { expires: 1, sameSite: "strict" });

    return response.data;
  },

  login: async (data: LoginRequest): Promise<{ user: User }> => {
    const response = await api.post('/Auth/login', data);
    Cookies.set("token", "abcd1234", { expires: 1, sameSite: "strict" });

    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/Auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    console.log('AuthService: Calling /Auth/me...');
    try {
      const response = await api.get('/Auth/me');
      console.log('AuthService: /Auth/me success:');

      return response.data;
    } catch (error: any) {
      console.log('AuthService: /Auth/me failed:', error.response?.status, error.response?.data);
      throw error;
    }
  },
};
