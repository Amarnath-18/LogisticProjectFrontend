import React from 'react';
import { ModularLocationPicker } from './ModularLocationPicker';

interface AddressData {
  formatted: string;
  city?: string;
  state?: string;
  country?: string;
}

interface AddressFieldGroupProps {
  originAddress: string;
  destinationAddress: string;
  onOriginChange: (address: string, city?: string, state?: string) => void;
  onDestinationChange: (address: string, city?: string, state?: string) => void;
}

export const AddressFieldGroup: React.FC<AddressFieldGroupProps> = ({
  originAddress,
  destinationAddress,
  onOriginChange,
  onDestinationChange,
}) => {
  const handleOriginSelect = (data: AddressData) => {
    onOriginChange(data.formatted, data.city, data.state);
  };

  const handleDestinationSelect = (data: AddressData) => {
    onDestinationChange(data.formatted, data.city, data.state);
  };

  return (
    <div className="space-y-4">
      <ModularLocationPicker
        label="Origin Address"
        value={originAddress}
        onChange={(val) => onOriginChange(val)}
        onLocationSelect={handleOriginSelect}
        placeholder="Enter pickup location"
        required
      />
      <ModularLocationPicker
        label="Destination Address"
        value={destinationAddress}
        onChange={(val) => onDestinationChange(val)}
        onLocationSelect={handleDestinationSelect}
        placeholder="Enter delivery location"
        required
      />
    </div>
  );
};
