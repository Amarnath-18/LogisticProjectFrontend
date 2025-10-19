import { api } from './api';
import { User, LoginRequest, RegisterRequest } from '../types';

export const authService = {
  register: async (data: RegisterRequest): Promise<{ user: User }> => {
    const response = await api.post('/Auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<{ user: User }> => {
    const response = await api.post('/Auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/Auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    console.log('AuthService: Calling /Auth/me...');
    try {
      const response = await api.get('/Auth/me');
      console.log('AuthService: /Auth/me success:', response.data);
      return response.data;
    } catch (error: any) {
      console.log('AuthService: /Auth/me failed:', error.response?.status, error.response?.data);
      throw error;
    }
  },
};
