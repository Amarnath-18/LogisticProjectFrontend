import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';
import { driverService } from '../services/driver.service';
import { UpdateDriverProfileRequest, UpdateDriverStatusRequest, UpdateDriverLocationRequest } from '../types';
import { Truck, MapPin, Settings, User } from 'lucide-react';

interface DriverProfileManagementProps {
  onProfileUpdated?: () => void;
}

export const DriverProfileManagement: React.FC<DriverProfileManagementProps> = ({
  onProfileUpdated
}) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [profileData, setProfileData] = useState<UpdateDriverProfileRequest>({
    maxActiveShipments: 5,
    vehicleType: '',
    licenseNumber: '',
    workStartTime: '',
    workEndTime: '',
    preferredRegion: ''
  });

  const [statusData, setStatusData] = useState<UpdateDriverStatusRequest>({
    status: 'Available'
  });

  const [locationData, setLocationData] = useState<UpdateDriverLocationRequest>({
    address: ''
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await driverService.updateProfile(profileData);
      setIsProfileModalOpen(false);
      onProfileUpdated?.();
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Failed to update profile:', error?.response);
      toast.error(error.response?.data || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await driverService.updateStatus(statusData);
      setIsStatusModalOpen(false);
      onProfileUpdated?.();
      toast.success('Status updated successfully');
    } catch (error: any) {
      console.error('Failed to update status:', error);
      toast.error(error.response?.data || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await driverService.updateLocation(locationData);
      setIsLocationModalOpen(false);
      onProfileUpdated?.();
      toast.success('Location updated successfully');
    } catch (error: any) {
      console.error('Failed to update location:', error);
      toast.error(error.response?.data || 'Failed to update location');
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateProfile = async () => {
    try {
      setUpdating(true);
      await driverService.createProfile();
      onProfileUpdated?.();
      toast.success('Driver profile created successfully');
    } catch (error: any) {
      console.error('Failed to create profile:', error);
      toast.error(error.response?.data || 'Failed to create profile');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card title="Driver Management">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={() => setIsProfileModalOpen(true)}
            variant="secondary"
            className="flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            Update Profile
          </Button>

          <Button
            onClick={() => setIsStatusModalOpen(true)}
            variant="secondary"
            className="flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Update Status
          </Button>

          <Button
            onClick={() => setIsLocationModalOpen(true)}
            variant="secondary"
            className="flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Update Location
          </Button>

          <Button
            onClick={handleCreateProfile}
            disabled={updating}
            className="flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            {updating ? 'Creating...' : 'Create Profile'}
          </Button>
        </div>
      </Card>

      {/* Profile Update Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Update Driver Profile"
        size="large"
      >
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              required
              label="Max Active Shipments"
              type="number"
              min="1"
              max="5"
              value={profileData.maxActiveShipments || ''}
              onChange={(e) => setProfileData({
                ...profileData,
                maxActiveShipments: parseInt(e.target.value) || 5
              })}
            />
            <Input
            required
              label="Vehicle Type"
              value={profileData.vehicleType || ''}
              onChange={(e) => setProfileData({
                ...profileData,
                vehicleType: e.target.value
              })}
              placeholder="e.g., Van, Truck, Car"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              required
              label="License Number"
              value={profileData.licenseNumber || ''}
              onChange={(e) => setProfileData({
                ...profileData,
                licenseNumber: e.target.value
              })}
              placeholder="Driver license number"
            />
            <Input
              required
              label="Preferred Region"
              value={profileData.preferredRegion || ''}
              onChange={(e) => setProfileData({
                ...profileData,
                preferredRegion: e.target.value
              })}
              placeholder="e.g., New York, California"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              required
              label="Work Start Time"
              type="time"
              value={profileData.workStartTime || ''}
              onChange={(e) => setProfileData({
                ...profileData,
                workStartTime: e.target.value
              })}
            />
            <Input
              required
              label="Work End Time"
              type="time"
              value={profileData.workEndTime || ''}
              onChange={(e) => setProfileData({
                ...profileData,
                workEndTime: e.target.value
              })}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsProfileModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updating}>
              {updating ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Update Driver Status"
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusData.status}
              onChange={(e) => setStatusData({
                ...statusData,
                status: e.target.value as any
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="OffDuty">Off Duty</option>
              <option value="OnBreak">On Break</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsStatusModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updating}>
              {updating ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Location Update Modal */}
      <Modal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        title="Update Current Location"
      >
        <form onSubmit={handleUpdateLocation} className="space-y-4">
          <Input
            label="Current Address"
            value={locationData.address}
            onChange={(e) => setLocationData({
              ...locationData,
              address: e.target.value
            })}
            placeholder="Enter your current address"
            required
          />

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsLocationModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updating}>
              {updating ? 'Updating...' : 'Update Location'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};