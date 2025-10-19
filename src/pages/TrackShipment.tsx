import { useState } from 'react';
import { Package, MapPin, Clock } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { Shipment } from '../types';
import { shipmentService } from '../services/shipment.service';

export const TrackShipment = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShipment(null);

    try {
      const data = await shipmentService.trackShipment(trackingNumber);
      setShipment(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Shipment not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Package className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Track Your Shipment</h1>
          <p className="text-gray-600 mt-2">Enter your tracking number to see the status</p>
        </div>

        <Card>
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number (e.g., LST123456)"
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Tracking...' : 'Track'}
              </Button>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </form>
        </Card>

        {shipment && (
          <div className="mt-8 space-y-6">
            <Card title="Shipment Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <p className="font-semibold">{shipment.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <StatusBadge status={shipment.status} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sender</p>
                  <p className="font-semibold">{shipment.sender.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Receiver</p>
                  <p className="font-semibold">{shipment.receiverName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Origin</p>
                  <p className="font-semibold">{shipment.originAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Destination</p>
                  <p className="font-semibold">{shipment.destinationAddress}</p>
                </div>
                {shipment.assignedDriver && (
                  <div>
                    <p className="text-sm text-gray-600">Driver</p>
                    <p className="font-semibold">{shipment.assignedDriver.fullName}</p>
                  </div>
                )}
              </div>
            </Card>

            {shipment.trackingUpdates && shipment.trackingUpdates.length > 0 && (
              <Card title="Tracking History">
                <div className="space-y-4">
                  {shipment.trackingUpdates.map((update, index) => (
                    <div
                      key={update.id}
                      className={`flex gap-4 ${
                        index !== shipment.trackingUpdates!.length - 1 ? 'pb-4 border-b' : ''
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge status={update.status} />
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(update.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {update.location && (
                          <p className="text-sm text-gray-700 font-medium">{update.location}</p>
                        )}
                        {update.remarks && (
                          <p className="text-sm text-gray-600 mt-1">{update.remarks}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Updated by: {update.updatedBy.fullName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
