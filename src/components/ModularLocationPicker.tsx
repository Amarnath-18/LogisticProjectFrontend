import React, { useState } from 'react';
import { AddressSearchInput } from './AddressSearchInput';

interface ModularLocationPickerProps {
  label: string;
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const ModularLocationPicker: React.FC<ModularLocationPickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "Enter address",
  required = false
}) => {
  const [searchInput, setSearchInput] = useState(value);

  const handleLocationSelect = (address: string) => {
    setSearchInput(address);
    onChange(address);
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