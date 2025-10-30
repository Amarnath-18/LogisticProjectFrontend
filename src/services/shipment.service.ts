import { api } from './api';
import { 
  Shipment, 
  CreateShipmentRequest, 
  UpdateShipmentStatusRequest, 
  ShipmentRatingStatusResponse
} from '../types';

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

  // assignDriver: async (id: string, data: AssignDriverRequest): Promise<void> => {
  //   await api.put(`/Shipments/${id}/assign-driver`, data);
  // },

  updateStatus: async (id: string, data: UpdateShipmentStatusRequest): Promise<void> => {
    await api.put(`/Shipments/${id}/status`, data);
  },

  // getDriverRecommendations: async (
  //   id: string, 
  //   priority?: 'Distance' | 'Experience' | 'Rating' | 'Availability' | 'Balanced'
  // ): Promise<DriverRecommendation[]> => {
  //   const params = priority ? `?priority=${priority}` : '';
  //   const response = await api.get(`/Shipments/${id}/driver-recommendations${params}`);
  //   return response.data;
  // },

  // smartAssign: async (id: string, data: SmartAssignRequest): Promise<DriverRecommendation | DriverRecommendation[]> => {
  //   const response = await api.post(`/Shipments/${id}/smart-assign`, data);
  //   return response.data;
  // },

  // getAvailableDrivers: async (): Promise<DriverAvailability[]> => {
  //   const response = await api.get('/Shipments/available-drivers');
  //   return response.data;
  // },

  getRatingStatus: async (shipmentId: string): Promise<ShipmentRatingStatusResponse> => {
    const response = await api.get(`/Shipments/${shipmentId}/rating-status`);
    return response.data;
  },
};
