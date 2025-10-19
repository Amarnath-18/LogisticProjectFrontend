import { api } from './api';
import { Shipment, CreateShipmentRequest, UpdateShipmentStatusRequest, AssignDriverRequest } from '../types';

export const shipmentService = {
  getAllShipments: async (): Promise<Shipment[]> => {
    const response = await api.get('/shipments');
    return response.data;
  },

  getShipmentById: async (id: number): Promise<Shipment> => {
    const response = await api.get(`/shipments/${id}`);
    return response.data;
  },

  createShipment: async (data: CreateShipmentRequest): Promise<Shipment> => {
    const response = await api.post('/shipments', data);
    return response.data;
  },

  trackShipment: async (trackingNumber: string): Promise<Shipment> => {
    const response = await api.get(`/shipments/track/${trackingNumber}`);
    return response.data;
  },

  assignDriver: async (id: number, data: AssignDriverRequest): Promise<void> => {
    await api.put(`/shipments/${id}/assign-driver`, data);
  },

  updateStatus: async (id: number, data: UpdateShipmentStatusRequest): Promise<void> => {
    await api.put(`/shipments/${id}/status`, data);
  },
};
