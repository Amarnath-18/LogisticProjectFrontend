import React from 'react';
import { ModularLocationPicker } from './ModularLocationPicker';

interface AddressFieldGroupProps {
  originAddress: string;
  destinationAddress: string;
  onOriginChange: (address: string) => void;
  onDestinationChange: (address: string) => void;
}

export const AddressFieldGroup: React.FC<AddressFieldGroupProps> = ({
  originAddress,
  destinationAddress,
  onOriginChange,
  onDestinationChange,
}) => {
  const handleOriginChange = (address: string) => {
    onOriginChange(address);
  };

  const handleDestinationChange = (address: string) => {
    onDestinationChange(address);
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