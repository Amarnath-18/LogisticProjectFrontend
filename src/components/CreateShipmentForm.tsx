import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { AddressFieldGroup } from './AddressFieldGroup';
import { CreateShipmentRequest } from '../types';
import { useAuth } from '../context/AuthContext';

interface CreateShipmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateShipmentRequest) => void;
  showDebugInfo?: boolean;
}

export const CreateShipmentForm: React.FC<CreateShipmentFormProps> = ({
  isOpen,
  onClose,
  onCreate,
  showDebugInfo = false
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreateShipmentRequest>({
    receiverName: '',
    receiverEmail: '',
    receiverPhone: '',
    originAddress: '',
    destinationAddress: '',
    originLatitude: undefined,
    originLongitude: undefined,
    destinationLatitude: undefined,
    destinationLongitude: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  const resetForm = () => {
    setFormData({
      receiverName: '',
      receiverEmail: '',
      receiverPhone: '',
      originAddress: '',
      destinationAddress: '',
      originLatitude: undefined,
      originLongitude: undefined,
      destinationLatitude: undefined,
      destinationLongitude: undefined,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleOriginChange = (address: string, lat?: number, lng?: number) => {
    setFormData(prev => ({
      ...prev,
      originAddress: address,
      originLatitude: lat,
      originLongitude: lng
    }));
  };

  const handleDestinationChange = (address: string, lat?: number, lng?: number) => {
    setFormData(prev => ({
      ...prev,
      destinationAddress: address,
      destinationLatitude: lat,
      destinationLongitude: lng
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Shipment">
      {showDebugInfo && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Current User Role:</strong> {user?.role || 'Not logged in'} | 
            <strong> User:</strong> {user?.fullName || 'Unknown'}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {user?.role === 'Customer' 
              ? '✅ Map picker enabled for customers' 
              : '❌ Map picker only available for customers'}
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Receiver Name"
          value={formData.receiverName}
          onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
          required
        />
        
        <Input
          label="Receiver Email"
          type="email"
          value={formData.receiverEmail}
          onChange={(e) => setFormData({ ...formData, receiverEmail: e.target.value })}
          required
        />
        
        <Input
          label="Receiver Phone"
          type="tel"
          value={formData.receiverPhone || ''}
          onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })}
        />

        <AddressFieldGroup
          originAddress={formData.originAddress}
          destinationAddress={formData.destinationAddress}
          onOriginChange={handleOriginChange}
          onDestinationChange={handleDestinationChange}
        />
        
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Create Shipment</Button>
        </div>
      </form>
    </Modal>
  );
};