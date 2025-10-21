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
    originCity: '',
    originRegion: '',
    destinationCity: '',
    destinationRegion: '',
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
      originCity: '',
      originRegion: '',
      destinationCity: '',
      destinationRegion: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleOriginChange = (address: string, city?: string, state?: string) => {
  setFormData(prev => ({
    ...prev,
    originAddress: address,
    originCity: city || prev.originCity,
    originRegion: state || prev.originRegion
  }));
};

const handleDestinationChange = (address: string, city?: string, state?: string) => {
  setFormData(prev => ({
    ...prev,
    destinationAddress: address,
    destinationCity: city || prev.destinationCity,
    destinationRegion: state || prev.destinationRegion
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

        {/* Optional City/Region Fields */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Origin City (Optional)"
            value={formData.originCity || ''}
            onChange={(e) => setFormData({ ...formData, originCity: e.target.value })}
            placeholder="e.g. New York"
          />
          <Input
            label="Origin Region/State (Optional)"
            value={formData.originRegion || ''}
            onChange={(e) => setFormData({ ...formData, originRegion: e.target.value })}
            placeholder="e.g. NY"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Destination City (Optional)"
            value={formData.destinationCity || ''}
            onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
            placeholder="e.g. Los Angeles"
          />
          <Input
            label="Destination Region/State (Optional)"
            value={formData.destinationRegion || ''}
            onChange={(e) => setFormData({ ...formData, destinationRegion: e.target.value })}
            placeholder="e.g. CA"
          />
        </div>
        
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