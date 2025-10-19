import { api } from './api';
import { User, UpdateUserRequest, UserRole } from '../types';

export const userService = {
  getAllUsers: async (role?: UserRole): Promise<User[]> => {
    const response = await api.get('/Users', { params: { role } });
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/Users/${id}`);
    return response.data;
  },

  updateUser: async (id: number, data: UpdateUserRequest): Promise<void> => {
    await api.put(`/Users/${id}`, data);
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/Users/${id}`);
  },

  getAllDrivers: async (): Promise<User[]> => {
    const response = await api.get('/Users/drivers');
    return response.data;
  },
};
