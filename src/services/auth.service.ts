import { api } from './api';
import { User, LoginRequest, RegisterRequest } from '../types';

export const authService = {
  register: async (data: RegisterRequest): Promise<{ user: User }> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<{ user: User }> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
