import { api } from './api';
import { Shipment, CreateShipmentRequest, UpdateShipmentStatusRequest, AssignDriverRequest } from '../types';

export const shipmentService = {
  getAllShipments: async (): Promise<Shipment[]> => {
    const response = await api.get('/Shipments');
    return response.data;
  },

  getShipmentById: async (id: string): Promise<Shipment> => {
    const response = await api.get(`/Shipments/${id}`);
    return response.data;
  },

  createShipment: async (data: CreateShipmentRequest): Promise<Shipment> => {
    const response = await api.post('/Shipments', data);
    return response.data;
  },

  trackShipment: async (trackingNumber: string): Promise<Shipment> => {
    const response = await api.get(`/Shipments/track/${trackingNumber}`);
    return response.data;
  },

  assignDriver: async (id: number, data: AssignDriverRequest): Promise<void> => {
    await api.put(`/Shipments/${id}/assign-driver`, data);
  },

  updateStatus: async (id: number, data: UpdateShipmentStatusRequest): Promise<void> => {
    await api.put(`/Shipments/${id}/status`, data);
  },
};
