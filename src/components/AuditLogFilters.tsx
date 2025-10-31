import { useState } from 'react';
import { AuditLogQueryRequest } from '../types';
import { Button } from './Button';
import { Input } from './Input';

interface AuditLogFiltersProps {
  onFilter: (filters: AuditLogQueryRequest) => void;
  loading?: boolean;
}

export const AuditLogFilters = ({ onFilter, loading = false }: AuditLogFiltersProps) => {
  const [filters, setFilters] = useState<AuditLogQueryRequest>({
    userId: '',
    action: '',
    targetTable: '',
    startDate: '',
    endDate: '',
  });

  const handleInputChange = (field: keyof AuditLogQueryRequest, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    // Remove empty string values before applying filters
    const cleanedFilters: AuditLogQueryRequest = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        cleanedFilters[key as keyof AuditLogQueryRequest] = value;
      }
    });
    onFilter(cleanedFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters: AuditLogQueryRequest = {
      userId: '',
      action: '',
      targetTable: '',
      startDate: '',
      endDate: '',
    };
    setFilters(emptyFilters);
    onFilter({});
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
            User ID
          </label>
          <Input
            id="userId"
            type="text"
            placeholder="Enter user ID"
            value={filters.userId || ''}
            onChange={(e) => handleInputChange('userId', e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-1">
            Action
          </label>
          <Input
            id="action"
            type="text"
            placeholder="e.g., Created, Updated, Login"
            value={filters.action || ''}
            onChange={(e) => handleInputChange('action', e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="targetTable" className="block text-sm font-medium text-gray-700 mb-1">
            Target Table
          </label>
          <select
            id="targetTable"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.targetTable || ''}
            onChange={(e) => handleInputChange('targetTable', e.target.value)}
            disabled={loading}
          >
            <option value="">All Tables</option>
            <option value="Users">Users</option>
            <option value="Shipments">Shipments</option>
            <option value="Drivers">Drivers</option>
            <option value="Ratings">Ratings</option>
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <Input
            id="startDate"
            type="datetime-local"
            value={filters.startDate || ''}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <Input
            id="endDate"
            type="datetime-local"
            value={filters.endDate || ''}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          onClick={handleApplyFilters}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Apply Filters
        </Button>
        <Button
          onClick={handleClearFilters}
          variant="secondary"
          disabled={loading}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};
