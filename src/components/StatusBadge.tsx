import { ShipmentStatus } from '../types';

interface StatusBadgeProps {
  status: ShipmentStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig: Record<ShipmentStatus, { color: string; label: string }> = {
    Created: { color: 'bg-gray-100 text-gray-800', label: 'Created' },
    PickedUp: { color: 'bg-blue-100 text-blue-800', label: 'Picked Up' },
    InTransit: { color: 'bg-yellow-100 text-yellow-800', label: 'In Transit' },
    Delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
    Cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
  };

  const config = statusConfig[status];

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
};
