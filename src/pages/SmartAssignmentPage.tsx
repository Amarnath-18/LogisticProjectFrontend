import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { SmartDriverAssignmentModal } from '../components/SmartDriverAssignmentModal';
import { AvailableDriversList } from '../components/AvailableDriversList';
import { shipmentService } from '../services/shipment.service';
import { Shipment, DriverRecommendation, DriverAvailability } from '../types';
import { ArrowLeft, Zap, Users, Target } from 'lucide-react';

export const SmartAssignmentPage = () => {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [recommendations, setRecommendations] = useState<DriverRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSmartModalOpen, setIsSmartModalOpen] = useState(false);
  const [refreshTrigger] = useState(0);

  useEffect(() => {
    if (shipmentId) {
      loadShipment();
      loadRecommendations();
    }
  }, [shipmentId]);

  const loadShipment = async () => {
    try {
      if (!shipmentId) return;
      const data = await shipmentService.getShipmentById(shipmentId);
      setShipment(data);
    } catch (error) {
      console.error('Failed to load shipment:', error);
    }
  };

  const loadRecommendations = async () => {
    try {
      if (!shipmentId) return;
      setLoading(true);
      const data = await shipmentService.getDriverRecommendations(shipmentId);
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignment = () => {
    navigate(`/shipments/${shipmentId}`);
  };

  const handleManualAssign = async (driver: DriverAvailability) => {
    try {
      if (!shipmentId) return;
      await shipmentService.smartAssign(shipmentId, {
        preferredDriverId: driver.driver.id.toString(),
        useAutoAssignment: true
      });
      handleAssignment();
    } catch (error: any) {
      console.error('Failed to assign driver:', error);
      toast.error(error.response?.data || 'Failed to assign driver');
    }
  };

  // Simpler approach: direct assignment from recommendation
  const handleRecommendationAssign = async (rec: DriverRecommendation) => {
    try {
      if (!shipmentId) return;
      await shipmentService.smartAssign(shipmentId, {
        preferredDriverId: rec.driver.id.toString(),
        useAutoAssignment: true
      });
      handleAssignment();
    } catch (error: any) {
      console.error('Failed to assign driver:', error);
      toast.error(error.response?.data || 'Failed to assign driver');
    }
  };

  if (!shipment) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }
  if (!shipmentId) return null;


  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/shipments/${shipmentId}`)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Shipment
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Driver Assignment</h1>
                <p className="text-gray-600 mt-1">
                  Intelligent driver recommendations for Shipment #{shipment.trackingNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsSmartModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Open Smart Assignment
              </Button>
            </div>
          </div>
        </div>

        {/* Shipment Info */}
        <Card title="Shipment Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">From</p>
              <p className="font-medium">{shipment.originAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">To</p>
              <p className="font-medium">{shipment.destinationAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                shipment.status === 'Created' ? 'bg-blue-100 text-blue-800' :
                shipment.status === 'PickedUp' ? 'bg-yellow-100 text-yellow-800' :
                shipment.status === 'InTransit' ? 'bg-purple-100 text-purple-800' :
                shipment.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {shipment.status}
              </span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recommended Drivers */}
          <div>
            <Card title="AI Recommendations" className="h-fit">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">
                  Based on distance, experience, rating, and availability
                </span>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.slice(0, 5).map((rec, index) => (
                    <div
                      key={rec.driver.id}
                      className={`p-4 border rounded-lg ${
                        index === 0 ? 'border-green-200 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{rec.driver.fullName}</h4>
                            {index === 0 && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                Best Match
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <span>Rating: {rec.rating?.toFixed(1) || 'N/A'}</span>
                            <span>Distance: {rec.distance?.toFixed(1) || 'N/A'} km</span>
                            <span>Experience: {rec.completedShipments || 0} shipments</span>
                            <span>Active: {rec.activeShipments}</span>
                          </div>
                          {rec.recommendationReason && (
                            <p className="text-sm text-blue-600 mt-2">{rec.recommendationReason}</p>
                          )}
                        </div>
                        <div className="ml-4 text-right">
                          {rec.score && (
                            <div className="text-lg font-bold text-green-600 mb-2">
                              {(rec.score * 100).toFixed(0)}%
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant={index === 0 ? 'primary' : 'secondary'}
                            onClick={() => handleRecommendationAssign(rec)}
                          >
                            Assign
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No recommendations available</p>
                </div>
              )}
            </Card>
          </div>

          {/* All Available Drivers */}
          <div>
            <Card title="All Available Drivers" className="h-fit">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">
                  Browse all drivers and their availability
                </span>
              </div>
              <AvailableDriversList
                refreshTrigger={refreshTrigger}
                onDriverSelect={handleManualAssign}
                showActions={true}
              />
            </Card>
          </div>
        </div>

        {/* Smart Assignment Modal */}
        <SmartDriverAssignmentModal
          isOpen={isSmartModalOpen}
          onClose={() => setIsSmartModalOpen(false)}
          shipmentId={shipmentId}
          onAssigned={handleAssignment}
        />
      </div>
    </Layout>
  );
};