import React, { useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface AddressSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (address: string) => void;
  placeholder?: string;
  required?: boolean;
  label?: string;
}

export const AddressSearchInput: React.FC<AddressSearchInputProps> = ({
  value,
  onChange,
  onLocationSelect,
  placeholder = "Enter address",
  required = false,
  label
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleManualSearch = async () => {
    if (!value.trim()) return;

    try {
      setIsSearching(true);
      
      // Simply validate the address format and call onLocationSelect
      // Remove geocoding as we're not using coordinates anymore
      if (value.trim().length > 5) {
        onChange(value.trim());
        onLocationSelect(value.trim());
      } else {
        alert('Please enter a more detailed address.');
      }
    } catch (error) {
      console.error('Address validation error:', error);
      alert('Error validating address. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleManualSearch();
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            ref={inputRef}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            required={required}
            autoComplete="off"
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={handleManualSearch}
          disabled={isSearching}
          className="shrink-0"
          title="Search address"
        >
          <Search className="w-4 h-4 mr-1" />
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>
      
      {/* Info message */}
      <div className="mt-1 text-xs text-gray-500">
        <span>Enter a detailed address and click Search to validate</span>
      </div>
    </div>
  );
};