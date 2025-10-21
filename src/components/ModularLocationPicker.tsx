import React, { useState } from 'react';
import { AddressSearchInput } from './AddressSearchInput';

interface AddressData {
  formatted: string;
  city?: string;
  state?: string;
  country?: string;
  lat?: number;
  lon?: number;
}

interface ModularLocationPickerProps {
  label: string;
  value: string;
  onChange: (address: string) => void;
  onLocationSelect?: (data: AddressData) => void; // new prop for structured data
  placeholder?: string;
  required?: boolean;
}

export const ModularLocationPicker: React.FC<ModularLocationPickerProps> = ({
  label,
  value,
  onChange,
  onLocationSelect,
  placeholder = "Enter address",
  required = false
}) => {
  const [searchInput, setSearchInput] = useState(value);

  const handleLocationSelect = (data: AddressData) => {
    setSearchInput(data.formatted);
    onChange(data.formatted);
    if (onLocationSelect) onLocationSelect(data);
  };

  return (
    <div className="space-y-2">
      <AddressSearchInput
        label={label}
        value={searchInput}
        onChange={(address: string) => {
          setSearchInput(address);
          onChange(address);
        }}
        onLocationSelect={handleLocationSelect}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};
