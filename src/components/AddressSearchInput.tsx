import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import axios from 'axios';
import { apiKey } from '../contraints';

interface AddressData {
  formatted: string;
  city?: string;
  state?: string;
  country?: string;
  lat?: number;
  lon?: number;
}

interface AddressSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (data: AddressData) => void; // now sends structured data
  placeholder?: string;
  required?: boolean;
  label?: string;
}

interface GeoFeature {
  properties: {
    formatted: string;
    city?: string;
    state?: string;
    country?: string;
    lat?: number;
    lon?: number;
  };
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
  const [suggestions, setSuggestions] = useState<GeoFeature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);


  const handleManualSearch = async () => {
    if (!value.trim()) return;

    try {
      setIsSearching(true);
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(value)}&apiKey=${apiKey}`
      );

      const features = res?.data?.features || [];
      setSuggestions(features);
      setShowSuggestions(true);

      if (features.length === 0) {
        toast.error("No results found. Try a more specific address.");
      }
    } catch (error) {
      console.error("Address validation error:", error);
      toast.error("Error validating address. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (suggestions.length > 0) setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleManualSearch();
    }
  };

  const handleSuggestionClick = (feature: GeoFeature) => {
    const props = feature.properties;
    const selectedData: AddressData = {
      formatted: props.formatted,
      city: props.city,
      state: props.state,
      country: props.country,
      lat: props.lat,
      lon: props.lon,
    };

    onChange(selectedData.formatted);
    onLocationSelect(selectedData);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full relative">
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
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-48 overflow-auto shadow-lg">
          {suggestions.map((feature, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(feature)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-700"
            >
              {feature.properties.formatted}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-1 text-xs text-gray-500">
        <span>Enter a detailed address and click Search to validate</span>
      </div>
    </div>
  );
};
