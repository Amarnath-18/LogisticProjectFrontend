import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { Button } from './Button';
import { Card } from './Card';
import { shipmentService } from '../services/shipment.service';
import { DriverRecommendation, SmartAssignRequest } from '../types';
import { Truck, Star, MapPin, Clock, Award } from 'lucide-react';

interface SmartDriverAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipmentId: string;
  onAssigned: () => void;
}

export const SmartDriverAssignmentModal: React.FC<SmartDriverAssignmentModalProps> = ({
  isOpen,
  onClose,
  shipmentId,
  onAssigned
}) => {
  const [recommendations, setRecommendations] = useState<DriverRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [priority, setPriority] = useState<'Distance' | 'Experience' | 'Rating' | 'Availability' | 'Balanced'>('Balanced');

  useEffect(() => {
    if (isOpen) {
      loadRecommendations();
    }
  }, [isOpen, priority]);

  const loadRecommendations = async () => {
    try {
        if(!shipmentId) return ;
      setLoading(true);
      const data = await shipmentService.getDriverRecommendations(shipmentId, priority);
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to load driver recommendations:', error);
      toast.error('Failed to load driver recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoAssign = async () => {
    try {
      setAssigning(true);
      const request: SmartAssignRequest = {
        useAutoAssignment: true,
        priority,
        maxRecommendations: 5
      };
      await shipmentService.smartAssign(shipmentId, request);
      onAssigned();
      onClose();
    } catch (error: any) {
      console.error('Failed to auto assign driver:', error);
      toast.error(error.response?.data || 'Failed to auto assign driver');
    } finally {
      setAssigning(false);
    }
  };

  const handleManualAssign = async (driverId: string) => {
    try {
      setAssigning(true);
      const request: SmartAssignRequest = {
        preferredDriverId: driverId,
        useAutoAssignment: true
      };
      await shipmentService.smartAssign(shipmentId, request);
      onAssigned();
      onClose();
    } catch (error: any) {
      console.error('Failed to assign driver:', error);
      toast.error(error.response?.data?.message || 'Failed to assign driver');
    } finally {
      setAssigning(false);
    }
  };

  const getPriorityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Busy': return 'bg-yellow-100 text-yellow-800';
      case 'OffDuty': return 'bg-gray-100 text-gray-800';
      case 'OnBreak': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Smart Driver Assignment" size="large">
      <div className="space-y-6">
        {/* Priority Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assignment Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Balanced">Balanced (Recommended)</option>
            <option value="Distance">Closest Distance</option>
            <option value="Experience">Most Experienced</option>
            <option value="Rating">Highest Rating</option>
            <option value="Availability">Most Available</option>
          </select>
        </div>

        {/* Auto Assignment Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleAutoAssign}
            disabled={assigning || loading}
            className="min-w-[200px]"
          >
            {assigning ? 'Assigning...' : ' Best Driver'}
          </Button>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Driver Recommendations</h3>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recommendations.map((recommendation, index) => (
                <Card key={recommendation.driver.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {recommendation.driver.fullName}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(recommendation.driverDetails.status)}`}>
                          {recommendation.driverDetails.status}
                        </span>
                        {recommendation.driverDetails.isVerified && (
                          <span title="Verified Driver">
                            <Award className="w-4 h-4 text-green-500" />
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          Rating: {recommendation.rating?.toFixed(1) || 'N/A'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Truck className="w-4 h-4" />
                          Completed: {recommendation.completedShipments || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          Distance: {recommendation.distance?.toFixed(1) || 'N/A'} km
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Active: {recommendation.activeShipments}
                        </div>
                      </div>

                      {recommendation.driverDetails.currentAddress && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Location:</strong> {recommendation.driverDetails.currentAddress}
                        </p>
                      )}

                      {recommendation.recommendationReason && (
                        <p className="text-sm text-blue-600 mb-2">
                          <strong>Why recommended:</strong> {recommendation.recommendationReason}
                        </p>
                      )}

                      {recommendation.recommendationFactors && (
                        <div className="flex flex-wrap gap-1">
                          {recommendation.recommendationFactors.map((factor, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                            >
                              {factor}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="ml-4 text-right">
                      {recommendation.score && (
                        <div className="mb-2">
                          <span className="text-xs text-gray-500">Match Score</span>
                          <div className={`text-lg font-bold ${getPriorityColor(recommendation.score)}`}>
                            {(recommendation.score * 100).toFixed(0)}%
                          </div>
                        </div>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleManualAssign(recommendation.driver.id.toString())}
                        disabled={assigning}
                        variant={index === 0 ? 'primary' : 'secondary'}
                      >
                        {index === 0 ? 'Assign (Best)' : 'Assign'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No driver recommendations available
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};