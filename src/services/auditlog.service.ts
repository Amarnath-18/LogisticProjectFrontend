import { api } from './api';
import {
  AuditLogResponse,
  AuditLogQueryRequest,
  AuditLogPagedResponse,
} from '../types';

/**
 * Get all audit logs with pagination and filters (Admin only)
 */
export const getAuditLogs = async (
  params?: AuditLogQueryRequest
): Promise<AuditLogPagedResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.userId) queryParams.append('userId', params.userId);
  if (params?.action) queryParams.append('action', params.action);
  if (params?.targetTable) queryParams.append('targetTable', params.targetTable);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
  if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

  const response = await api.get<AuditLogPagedResponse>(
    `/auditlogs?${queryParams.toString()}`
  );
  return response.data;
};

/**
 * Get a specific audit log by ID (Admin only)
 */
export const getAuditLogById = async (id: string): Promise<AuditLogResponse> => {
  const response = await api.get<AuditLogResponse>(`/auditlogs/${id}`);
  return response.data;
};

/**
 * Get audit logs for a specific user (Admin only)
 */
export const getAuditLogsByUserId = async (
  userId: string,
  pageNumber: number = 1,
  pageSize: number = 20
): Promise<AuditLogResponse[]> => {
  const response = await api.get<AuditLogResponse[]>(
    `/auditlogs/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return response.data;
};

/**
 * Get audit logs for a specific target (Admin only)
 */
export const getAuditLogsByTarget = async (
  targetTable: string,
  targetId: string
): Promise<AuditLogResponse[]> => {
  const response = await api.get<AuditLogResponse[]>(
    `/auditlogs/target/${targetTable}/${targetId}`
  );
  return response.data;
};

/**
 * Get current user's activity logs (All authenticated users)
 */
export const getMyActivity = async (
  pageNumber: number = 1,
  pageSize: number = 20
): Promise<AuditLogResponse[]> => {
  const response = await api.get<AuditLogResponse[]>(
    `/auditlogs/my-activity?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return response.data;
};
