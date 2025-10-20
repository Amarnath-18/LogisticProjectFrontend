import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';
import { userService } from '../services/user.service';
import { UpdateUserRequest, User } from '../types';
import { User as UserIcon, Mail, Phone, Edit } from 'lucide-react';

interface UserProfileManagementProps {
  user: User;
  onProfileUpdated?: () => void;
}

export const UserProfileManagement: React.FC<UserProfileManagementProps> = ({
  user,
  onProfileUpdated
}) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [profileData, setProfileData] = useState<UpdateUserRequest>({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || ''
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await userService.updateUser(user.id, profileData);
      setIsProfileModalOpen(false);
      onProfileUpdated?.();
      alert('Profile updated successfully');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card title="User Profile">
        <div className="space-y-4">
          {/* Current Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <UserIcon className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">{user.fullName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{user.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">{user.role[0]}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Role</p>
                <p className="font-medium text-gray-900">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Profile Actions */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button
              onClick={() => setIsProfileModalOpen(true)}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Profile Update Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Update Profile"
        size="medium"
      >
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input
            label="Full Name"
            value={profileData.fullName || ''}
            onChange={(e) => setProfileData({
              ...profileData,
              fullName: e.target.value
            })}
            required
          />

          <Input
            label="Email"
            type="email"
            value={profileData.email || ''}
            onChange={(e) => setProfileData({
              ...profileData,
              email: e.target.value
            })}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            value={profileData.phone || ''}
            onChange={(e) => setProfileData({
              ...profileData,
              phone: e.target.value
            })}
            placeholder="Optional"
          />

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
    </div>
  );
};