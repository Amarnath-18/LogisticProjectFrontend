import { useState, useEffect } from 'react';
import { shipmentService } from '../services';
import { ShipmentRatingStatusResponse } from '../types';

export const useShipmentRating = (shipmentId: string | number) => {
  const [ratingStatus, setRatingStatus] = useState<ShipmentRatingStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shipmentId) {
      checkRatingStatus();
    }
  }, [shipmentId]);

  const checkRatingStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const status = await shipmentService.getRatingStatus(shipmentId.toString());
      setRatingStatus(status);
    } catch (err) {
      console.error('Error checking rating status:', err);
      setError('Failed to check rating status');
      // Default to not rated if we can't check
      setRatingStatus({
        shipmentId: shipmentId.toString(),
        trackingNumber: '',
        isRated: false,
        canBeRated: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRated = (rating: number, comment?: string) => {
    setRatingStatus(prev => prev ? {
      ...prev,
      isRated: true,
      existingRating: {
        rating,
        comment,
        ratedAt: new Date().toISOString(),
        ratedByCustomer: 'Current User', // This would come from auth context in real implementation
        shipmentTrackingNumber: prev.trackingNumber
      }
    } : null);
  };

  return {
    ratingStatus,
    isLoading,
    error,
    checkRatingStatus,
    markAsRated,
  };
};