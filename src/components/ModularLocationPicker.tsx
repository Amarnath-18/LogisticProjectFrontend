import React, { useState } from 'react';
import { AddressSearchInput } from './AddressSearchInput';

interface ModularLocationPickerProps {
  label: string;
  value: string;
  onChange: (address: string, lat: number, lng: number) => void;
  placeholder?: string;
  required?: boolean;
}

export const ModularLocationPicker: React.FC<ModularLocationPickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "Enter address to get coordinates",
  required = false
}) => {
  const [searchInput, setSearchInput] = useState(value);

  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    setSearchInput(address);
    onChange(address, lat, lng);
  };

  return (
    <div className="space-y-2">
      <AddressSearchInput
        label={label}
        value={searchInput}
        onChange={(address: string) => {
          setSearchInput(address);
        }}
        onLocationSelect={handleLocationSelect}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};