export type UserRole = 'Admin' | 'Driver' | 'Customer';

export type ShipmentStatus = 'Created' | 'PickedUp' | 'InTransit' | 'Delivered' | 'Cancelled';

export type ReportType = 'Daily' | 'Weekly' | 'Monthly' | 'Custom';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface TrackingUpdate {
  id: string;
  status: ShipmentStatus;
  location?: string;
  remarks?: string;
  updatedBy: User;
  timestamp: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  sender: User;
  receiverName: string;
  receiverEmail: string;
  receiverPhone?: string;
  originAddress: string;
  destinationAddress: string;
  originCity?: string;
  originRegion?: string;
  destinationCity?: string;
  destinationRegion?: string;
  status: ShipmentStatus;
  assignedDriver?: User;
  createdAt: string;
  updatedAt: string;
  trackingUpdates?: TrackingUpdate[];
  // Rating information
  isRatedByCustomer?: boolean;
  customerRating?: {
    rating: number;
    comment?: string;
    ratedAt: string;
  };
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
  originCity?: string;
  originRegion?: string;
  destinationCity?: string;
  destinationRegion?: string;
}

export interface UpdateShipmentStatusRequest {
  status: ShipmentStatus;
  location?: string;
  remarks?: string;
}

export interface AssignDriverRequest {
  driverId: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface DriverDetails {
  status: 'Available' | 'Busy' | 'OffDuty' | 'OnBreak';
  currentAddress?: string;
  maxActiveShipments?: number;
  vehicleType?: string;
  licenseNumber?: string;
  isVerified?: boolean;
  lastActiveTime?: string;
  workStartTime?: string;
  workEndTime?: string;
  preferredRegion?: string;
}

export interface DriverRecommendation {
  driver: User;
  driverDetails: DriverDetails;
  distance?: number;
  activeShipments: number;
  rating?: number;
  completedShipments?: number;
  lastLocationUpdate?: string;
  score?: number;
  recommendationReason?: string;
  recommendationFactors?: string[];
}

export interface DriverAvailability {
  driver: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    createdAt: string;
  };
  driverDetails: {
    status: 'Available' | 'Busy' | 'OffDuty' | 'OnBreak';
    currentAddress: string;
    maxActiveShipments: number;
    vehicleType: string;
    licenseNumber: string;
    isVerified: boolean;
    lastActiveTime: string;
    workStartTime: string;
    workEndTime: string;
    preferredRegion: string;
  };
  activeShipments: number;
  isAvailable: boolean;
  availabilityReason: string;
  rating: number;
  completedShipments: number;
  totalRatings: number;
  lastLocationUpdate: string;
  performanceCategory: string;
  performanceFactors: string[];
}

export interface SmartAssignRequest {
  preferredDriverId?: string;
  useAutoAssignment?: boolean;
  maxRecommendations?: number;
  priority?: 'Distance' | 'Experience' | 'Rating' | 'Availability' | 'Balanced';
}

export interface UpdateDriverLocationRequest {
  address: string;
}

export interface UpdateDriverStatusRequest {
  status: 'Available' | 'Busy' | 'OffDuty' | 'OnBreak';
}

export interface UpdateDriverProfileRequest {
  maxActiveShipments?: number;
  vehicleType?: string;
  licenseNumber?: string;
  workStartTime?: string;
  workEndTime?: string;
  preferredRegion?: string;
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
  id: string;
  reportType: ReportType;
  startDate: string;
  endDate: string;
  filePath: string;
  generatedAt: string;
  generatedBy: User;
}

export interface RateDriverRequest {
  rating: number;
  comment?: string;
  shipmentId: string;
}

export interface DriverRating {
  rating: number;
  comment?: string;
  ratedAt: string;
  ratedByCustomer: string;
  shipmentTrackingNumber: string;
}

export interface DriverRatingsResponse {
  driverId: string;
  driver: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    role: UserRole;
    createdAt: string;
  };
  averageRating: number;
  totalRatings: number;
  completedShipments: number;
  isVerified: boolean;
  recentRatings: DriverRating[];
}

export interface ShipmentRatingStatusResponse {
  shipmentId: string;
  trackingNumber: string;
  isRated: boolean;
  existingRating?: {
    rating: number;
    comment?: string;
    ratedAt: string;
    ratedByCustomer: string;
    shipmentTrackingNumber: string;
  };
  driver?: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    role: UserRole;
    createdAt: string;
  };
  canBeRated: boolean;
  ratingIneligibilityReason?: string;
}
