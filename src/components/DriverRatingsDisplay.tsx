import React, { useState, useEffect } from 'react';
import { driverService } from '../services';
import { DriverRatingsResponse } from '../types';
import { Card } from './Card';

interface DriverRatingsDisplayProps {
  driverId: string;
  showFullProfile?: boolean;
}

export const DriverRatingsDisplay: React.FC<DriverRatingsDisplayProps> = ({
  driverId,
  showFullProfile = false,
}) => {
  const [ratingsData, setRatingsData] = useState<DriverRatingsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchDriverRatings();
  }, [driverId]);

  const fetchDriverRatings = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await driverService.getDriverRatings(driverId);
      setRatingsData(data);
    } catch (err) {
      console.error('Error fetching driver ratings:', err);
      setError('Failed to load driver ratings');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-lg ${
            i <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-red-600 text-center py-4">
          {error}
        </div>
      </Card>
    );
  }

  if (!ratingsData) {
    return null;
  }

  return (
    <div className="space-y-4">
      {showFullProfile && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{ratingsData.driver.fullName}</h3>
              {ratingsData.isVerified && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Verified
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex justify-center items-center mb-1">
                  {renderStars(Math.round(ratingsData.averageRating))}
                </div>
                <p className="text-sm text-gray-600">
                  {ratingsData.averageRating.toFixed(1)} Average
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {ratingsData.totalRatings}
                </p>
                <p className="text-sm text-gray-600">Total Ratings</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {ratingsData.completedShipments}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{ratingsData.driver.email}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <h4 className="text-md font-semibold mb-4">Recent Ratings</h4>
        
        {ratingsData.recentRatings.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No ratings yet</p>
        ) : (
          <div className="space-y-4">
            {ratingsData.recentRatings.map((rating, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(rating.rating)}</div>
                    <span className="text-sm text-gray-500">
                      by {rating.ratedByCustomer}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDate(rating.ratedAt)}
                  </span>
                </div>
                
                {rating.comment && (
                  <p className="text-sm text-gray-700 mb-2">"{rating.comment}"</p>
                )}
                
                <p className="text-xs text-gray-500">
                  Shipment: {rating.shipmentTrackingNumber}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};