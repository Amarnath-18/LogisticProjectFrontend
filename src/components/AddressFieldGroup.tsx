import React from 'react';
import { ModularLocationPicker } from './ModularLocationPicker';

interface AddressFieldGroupProps {
  originAddress: string;
  destinationAddress: string;
  onOriginChange: (address: string, lat?: number, lng?: number) => void;
  onDestinationChange: (address: string, lat?: number, lng?: number) => void;
}

export const AddressFieldGroup: React.FC<AddressFieldGroupProps> = ({
  originAddress,
  destinationAddress,
  onOriginChange,
  onDestinationChange,
}) => {
  const handleOriginChange = (address: string, lat?: number, lng?: number) => {
    onOriginChange(address, lat, lng);
  };

  const handleDestinationChange = (address: string, lat?: number, lng?: number) => {
    onDestinationChange(address, lat, lng);
  };

  return (
    <div className="space-y-4">
      {/* Origin Address Field */}
      <ModularLocationPicker
        label="Origin Address"
        value={originAddress}
        onChange={handleOriginChange}
        placeholder="Enter pickup location"
        required
      />

      {/* Destination Address Field */}
      <ModularLocationPicker
        label="Destination Address"
        value={destinationAddress}
        onChange={handleDestinationChange}
        placeholder="Enter delivery location"
        required
      />
    </div>
  );
};