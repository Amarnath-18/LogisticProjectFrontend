import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { DriverAvailability } from '../types';
import { shipmentService } from '../services/shipment.service';
import { Truck, MapPin, Clock, Star, Award, RefreshCw } from 'lucide-react';

interface AvailableDriversListProps {
  refreshTrigger?: number;
  onDriverSelect?: (driver: DriverAvailability) => void;
  showActions?: boolean;
}

export const AvailableDriversList: React.FC<AvailableDriversListProps> = ({
  refreshTrigger,
  onDriverSelect,
  showActions = false
}) => {
  const [drivers, setDrivers] = useState<DriverAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAvailableDrivers();
  }, [refreshTrigger]);

  const loadAvailableDrivers = async () => {
    try {
      setLoading(true);
      // Get drivers from shipment service which has more complete data for availability
      const shipmentDrivers = await shipmentService.getAvailableDrivers();
      console.log(shipmentDrivers);
      
      setDrivers(shipmentDrivers);
    } catch (error) {
      console.error('Failed to load available drivers:', error);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Busy': return 'bg-yellow-100 text-yellow-800';
      case 'OffDuty': return 'bg-gray-100 text-gray-800';
      case 'OnBreak': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Not set';
    return timeString.substring(0, 5); // HH:mm format
  };

  if (loading) {
    return (
      <Card title="Available Drivers">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Available Drivers">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm text-gray-600">
          {drivers.length} driver{drivers.length !== 1 ? 's' : ''} found
        </h4>
        <Button
          variant="secondary"
          size="sm"
          onClick={loadAvailableDrivers}
          disabled={loading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      {drivers.length > 0 ? (
        <div className="space-y-4">
          {drivers.map((driverInfo) => (
            <div
              key={driverInfo.driver.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {driverInfo.driver.fullName}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(driverInfo.driverDetails.status)}`}>
                      {driverInfo.driverDetails.status}
                    </span>
                    {driverInfo.driverDetails.isVerified && (
                      <span title="Verified Driver">
                        <Award className="w-4 h-4 text-green-500" />
                      </span>
                    )}
                    {/* {driverInfo.isAvailable && (
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                        Available
                      </span>
                    )} */}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      {driverInfo.driverDetails.vehicleType || 'Vehicle not specified'}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {driverInfo.driverDetails.currentAddress || 'Location not set'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Work: {formatTime(driverInfo.driverDetails.workStartTime)} - {formatTime(driverInfo.driverDetails.workEndTime)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Active: {driverInfo.activeShipments} / {driverInfo.driverDetails.maxActiveShipments || 5}
                    </div>
                  </div>

                  {/* New performance metrics section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600 mb-3 bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Rating: {driverInfo.rating > 0 ? `${driverInfo.rating.toFixed(1)}/5` : 'No ratings'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4 text-blue-500" />
                      Completed: {driverInfo.completedShipments}
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-purple-500" />
                      Reviews: {driverInfo.totalRatings}
                    </div>
                  </div>

                  {/* Performance category and factors */}
                  {driverInfo.performanceCategory && (
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Performance: {driverInfo.performanceCategory}
                      </span>
                    </div>
                  )}

                  {driverInfo.performanceFactors && driverInfo.performanceFactors.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Performance Factors:</div>
                      <div className="flex flex-wrap gap-1">
                        {driverInfo.performanceFactors.map((factor, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                          >
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-sm">
                    <p className="text-gray-600">
                      <strong>Email:</strong> {driverInfo.driver.email}
                    </p>
                    {driverInfo.driver.phone && (
                      <p className="text-gray-600">
                        <strong>Phone:</strong> {driverInfo.driver.phone}
                      </p>
                    )}
                    {driverInfo.driverDetails.licenseNumber && (
                      <p className="text-gray-600">
                        <strong>License:</strong> {driverInfo.driverDetails.licenseNumber}
                      </p>
                    )}
                    {driverInfo.driverDetails.preferredRegion && (
                      <p className="text-gray-600">
                        <strong>Preferred Region:</strong> {driverInfo.driverDetails.preferredRegion}
                      </p>
                    )}
                  </div>

                  {driverInfo.availabilityReason && (
                    <div className="mt-2 text-sm">
                      <span className="text-blue-600 font-medium">Status: </span>
                      <span className="text-gray-700">{driverInfo.availabilityReason}</span>
                    </div>
                  )}

                  <div className="mt-2 space-y-1">
                    {driverInfo.driverDetails.lastActiveTime && (
                      <div className="text-xs text-gray-500">
                        Last active: {new Date(driverInfo.driverDetails.lastActiveTime).toLocaleString()}
                      </div>
                    )}
                    {driverInfo.lastLocationUpdate && (
                      <div className="text-xs text-gray-500">
                        Last location update: {new Date(driverInfo.lastLocationUpdate).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                {showActions && onDriverSelect && (
                  <div className="ml-4">
                    <Button
                      size="sm"
                      onClick={() => onDriverSelect(driverInfo)}
                      disabled={!driverInfo.isAvailable}
                      variant={driverInfo.isAvailable ? 'primary' : 'secondary'}
                    >
                      {driverInfo.isAvailable ? 'Select' : 'Unavailable'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No drivers available at the moment</p>
        </div>
      )}
    </Card>
  );
};