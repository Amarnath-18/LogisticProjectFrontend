import { api } from './api';
import { 
  UpdateDriverLocationRequest,
  UpdateDriverStatusRequest,
  UpdateDriverProfileRequest,
  DriverAvailability,
  User
} from '../types';

export const driverService = {
  updateLocation: async (data: UpdateDriverLocationRequest): Promise<void> => {
    await api.post('/Drivers/location', data);
  },

  updateStatus: async (data: UpdateDriverStatusRequest): Promise<void> => {
    await api.put('/Drivers/status', data);
  },

  updateProfile: async (data: UpdateDriverProfileRequest): Promise<void> => {
    await api.put('/Drivers/profile', data);
  },

  createProfile: async (): Promise<void> => {
    await api.post('/Drivers/profile');
  },

  getAvailability: async (): Promise<DriverAvailability[]> => {
    const response = await api.get('/Drivers/availability');
    return response.data;
  },

  getAllDrivers: async (): Promise<User[]> => {
    const response = await api.get('/Drivers');
    return response.data;
  },

  getDriverById: async (id: string): Promise<User> => {
    const response = await api.get(`/Drivers/${id}`);
    return response.data;
  },
};