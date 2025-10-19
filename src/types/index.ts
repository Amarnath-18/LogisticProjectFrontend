export type UserRole = 'Admin' | 'Driver' | 'Customer';

export type ShipmentStatus = 'Created' | 'PickedUp' | 'InTransit' | 'Delivered' | 'Cancelled';

export type ReportType = 'Daily' | 'Weekly' | 'Monthly' | 'Custom';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface TrackingUpdate {
  id: number;
  status: ShipmentStatus;
  location?: string;
  latitude?: number;
  longitude?: number;
  remarks?: string;
  updatedBy: User;
  timestamp: string;
}

export interface Shipment {
  id: number;
  trackingNumber: string;
  sender: User;
  receiverName: string;
  receiverEmail: string;
  receiverPhone?: string;
  originAddress: string;
  destinationAddress: string;
  originLatitude?: number;
  originLongitude?: number;
  destinationLatitude?: number;
  destinationLongitude?: number;
  status: ShipmentStatus;
  assignedDriver?: User;
  createdAt: string;
  updatedAt: string;
  trackingUpdates?: TrackingUpdate[];
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateShipmentRequest {
  receiverName: string;
  receiverEmail: string;
  receiverPhone?: string;
  originAddress: string;
  destinationAddress: string;
  originLatitude?: number;
  originLongitude?: number;
  destinationLatitude?: number;
  destinationLongitude?: number;
}

export interface UpdateShipmentStatusRequest {
  status: ShipmentStatus;
  location?: string;
  latitude?: number;
  longitude?: number;
  remarks?: string;
}

export interface AssignDriverRequest {
  driverId: number;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface DashboardAnalytics {
  totalShipments: number;
  activeShipments: number;
  deliveredShipments: number;
  pendingShipments: number;
  totalDrivers: number;
  totalCustomers: number;
  shipmentsByStatus: {
    status: ShipmentStatus;
    count: number;
  }[];
  monthlyStats: {
    month: string;
    count: number;
  }[];
}

export interface GenerateReportRequest {
  reportType: ReportType;
  startDate: string;
  endDate: string;
}

export interface Report {
  id: number;
  reportType: ReportType;
  startDate: string;
  endDate: string;
  filePath: string;
  generatedAt: string;
  generatedBy: User;
}
