import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { DriverRatingModal } from './DriverRatingModal';
import { shipmentService } from '../services';
import { Shipment, ShipmentRatingStatusResponse } from '../types';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface ShipmentWithRatingStatus extends Shipment {
  ratingStatus?: ShipmentRatingStatusResponse;
}

export const PendingRatingsCard: React.FC = () => {
  const [deliveredShipments, setDeliveredShipments] = useState<ShipmentWithRatingStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'Customer') {
      loadDeliveredShipments();
    }
  }, [user]);

  const loadDeliveredShipments = async () => {
    try {
      setIsLoading(true);
      const shipments = await shipmentService.getAllShipments();
      
      // Filter for delivered shipments that have assigned drivers (candidates for rating)
      const delivered = shipments.filter(
        (shipment: Shipment) => 
          shipment.status === 'Delivered' && 
          shipment.assignedDriver &&
          shipment.sender.id === user?.id // Only show customer's own shipments
      );

      // Check rating status for each shipment
      const shipmentsWithRatingStatus = await Promise.all(
        delivered.map(async (shipment) => {
          try {
            const ratingStatus = await shipmentService.getRatingStatus(shipment.id.toString());
            return { ...shipment, ratingStatus };
          } catch (error) {
            console.error(`Failed to get rating status for shipment ${shipment.id}:`, error);
            // If we can't check rating status, assume it can be rated
            return { 
              ...shipment, 
              ratingStatus: {
                shipmentId: shipment.id.toString(),
                trackingNumber: shipment.trackingNumber,
                isRated: false,
                canBeRated: true
              }
            };
          }
        })
      );

      // Filter out shipments that are already rated or cannot be rated
      const pendingRatings = shipmentsWithRatingStatus.filter(
        shipment => !shipment.ratingStatus?.isRated && shipment.ratingStatus?.canBeRated
      );

      setDeliveredShipments(pendingRatings);
    } catch (error) {
      console.error('Failed to load delivered shipments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRateDriver = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmitted = () => {
    toast.success('Thank you for your feedback!');
    setIsRatingModalOpen(false);
    
    // Remove the rated shipment from the list immediately
    if (selectedShipment) {
      setDeliveredShipments(prev => 
        prev.filter(shipment => shipment.id !== selectedShipment.id)
      );
    }
    
    setSelectedShipment(null);
  };

  if (user?.role !== 'Customer' || isLoading) {
    return null;
  }

  if (deliveredShipments.length === 0) {
    return null;
  }

  return (
    <>
      <Card title="📝 Rate Your Recent Deliveries">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Help us improve our service by rating your recent deliveries:
          </p>
          
          {deliveredShipments.slice(0, 3).map((shipment) => (
            <div
              key={shipment.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{shipment.trackingNumber}</p>
                <p className="text-xs text-gray-600">
                  Driver: {shipment.assignedDriver?.fullName}
                </p>
                <p className="text-xs text-gray-500">
                  Delivered to: {shipment.destinationAddress}
                </p>
              </div>
              
              <Button
                size="sm"
                onClick={() => handleRateDriver(shipment)}
                className="ml-3 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 text-xs"
              >
                ⭐ Rate
              </Button>
            </div>
          ))}
          
          {deliveredShipments.length > 3 && (
            <p className="text-xs text-gray-500 text-center">
              +{deliveredShipments.length - 3} more deliveries ready for rating
            </p>
          )}
        </div>
      </Card>

      {selectedShipment && selectedShipment.assignedDriver && (
        <DriverRatingModal
          isOpen={isRatingModalOpen}
          onClose={() => {
            setIsRatingModalOpen(false);
            setSelectedShipment(null);
          }}
          driverId={selectedShipment.assignedDriver.id.toString()}
          driverName={selectedShipment.assignedDriver.fullName}
          shipmentId={selectedShipment.id.toString()}
          onRatingSubmitted={handleRatingSubmitted}
        />
      )}
    </>
  );
};