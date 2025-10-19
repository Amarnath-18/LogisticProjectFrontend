import { api } from './api';
import { User, UpdateUserRequest, UserRole } from '../types';

export const userService = {
  getAllUsers: async (role?: UserRole): Promise<User[]> => {
    const response = await api.get('/users', { params: { role } });
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: number, data: UpdateUserRequest): Promise<void> => {
    await api.put(`/users/${id}`, data);
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getAllDrivers: async (): Promise<User[]> => {
    const response = await api.get('/users/drivers');
    return response.data;
  },
};
