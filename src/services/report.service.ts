import { api } from './api';
import { DashboardAnalytics, GenerateReportRequest, Report } from '../types';

export const reportService = {
  getAnalytics: async (): Promise<DashboardAnalytics> => {
    const response = await api.get('/Reports/analytics');
    return response.data;
  },

  generateReport: async (data: GenerateReportRequest): Promise<Report> => {
    const response = await api.post('/Reports/generate', data);
    return response.data;
  },

  downloadReport: async (id: number): Promise<Blob> => {
    const response = await api.get(`/Reports/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getAllReports: async (): Promise<Report[]> => {
    const response = await api.get('/Reports');
    return response.data;
  },
};
