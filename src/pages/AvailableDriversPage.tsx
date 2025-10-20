import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { AvailableDriversList } from '../components/AvailableDriversList';
import { DriverAvailability } from '../types';
import { Users, RefreshCw, Filter } from 'lucide-react';

export const AvailableDriversPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedDriver, setSelectedDriver] = useState<DriverAvailability | null>(null);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDriverSelect = (driver: DriverAvailability) => {
    setSelectedDriver(driver);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Available Drivers</h1>
                <p className="text-gray-600 mt-1">
                  View and manage driver availability and assignments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {showOnlyAvailable ? 'Show All' : 'Available Only'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Driver List */}
          <div className="xl:col-span-2">
            <AvailableDriversList
              refreshTrigger={refreshTrigger}
              onDriverSelect={handleDriverSelect}
              showActions={true}
            />
          </div>

          {/* Driver Details Sidebar */}
          <div className="xl:col-span-1">
            {selectedDriver ? (
              <Card title="Driver Details">
                <div className="space-y-4">
                  <div className="text-center pb-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedDriver.driver.fullName}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedDriver.driver.email}</p>
                    {selectedDriver.driver.phone && (
                      <p className="text-sm text-gray-600">{selectedDriver.driver.phone}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedDriver.driverDetails.status === 'Available' ? 'bg-green-100 text-green-800' :
                        selectedDriver.driverDetails.status === 'Busy' ? 'bg-yellow-100 text-yellow-800' :
                        selectedDriver.driverDetails.status === 'OffDuty' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedDriver.driverDetails.status}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Vehicle Type</span>
                      <span className="text-sm font-medium">
                        {selectedDriver.driverDetails.vehicleType || 'Not specified'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Shipments</span>
                      <span className="text-sm font-medium">
                        {selectedDriver.activeShipments} / {selectedDriver.driverDetails.maxActiveShipments || 5}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Is Available</span>
                      <span className={`text-sm font-medium ${
                        selectedDriver.isAvailable ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedDriver.isAvailable ? 'Yes' : 'No'}
                      </span>
                    </div>

                    {selectedDriver.driverDetails.currentAddress && (
                      <div>
                        <span className="text-sm text-gray-600 block mb-1">Current Location</span>
                        <span className="text-sm font-medium">
                          {selectedDriver.driverDetails.currentAddress}
                        </span>
                      </div>
                    )}

                    {selectedDriver.driverDetails.preferredRegion && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Preferred Region</span>
                        <span className="text-sm font-medium">
                          {selectedDriver.driverDetails.preferredRegion}
                        </span>
                      </div>
                    )}

                    {selectedDriver.driverDetails.workStartTime && selectedDriver.driverDetails.workEndTime && (
                      <div>
                        <span className="text-sm text-gray-600 block mb-1">Work Hours</span>
                        <span className="text-sm font-medium">
                          {selectedDriver.driverDetails.workStartTime?.substring(0, 5)} - {selectedDriver.driverDetails.workEndTime?.substring(0, 5)}
                        </span>
                      </div>
                    )}

                    {selectedDriver.driverDetails.licenseNumber && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">License Number</span>
                        <span className="text-sm font-medium">
                          {selectedDriver.driverDetails.licenseNumber}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Verified Driver</span>
                      <span className={`text-sm font-medium ${
                        selectedDriver.driverDetails.isVerified ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedDriver.driverDetails.isVerified ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Availability Status:</p>
                    <p className="text-sm font-medium text-blue-600">
                      {selectedDriver.availabilityReason}
                    </p>
                  </div>

                  {selectedDriver.driverDetails.lastActiveTime && (
                    <div className="pt-2">
                      <p className="text-xs text-gray-500">
                        Last active: {new Date(selectedDriver.driverDetails.lastActiveTime).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card title="Driver Details">
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">
                    Select a driver from the list to view their details
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};