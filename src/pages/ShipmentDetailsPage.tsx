import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';

import { DriverRatingModal } from '../components/DriverRatingModal';
import { Shipment, UpdateShipmentStatusRequest, ShipmentStatus } from '../types';
import { useShipmentRating } from '../hooks/useShipmentRating';
import { shipmentService } from '../services/shipment.service';
import { useAuth } from '../context/AuthContext';
import { MapPin, Clock } from 'lucide-react';

export const ShipmentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const { user } = useAuth();
  
  // Use the rating hook to check if shipment is already rated
  const { ratingStatus, isLoading: isLoadingRating, markAsRated } = useShipmentRating(id || '');
  
  useEffect(() => {
    loadShipment();
  }, [id]);

  const loadShipment = async () => {
    try {
      if(!id) return ;
      const data = await shipmentService.getShipmentById(id);
      setShipment(data);
    } catch (error) {
      console.error('Failed to load shipment:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleRatingSubmitted = (rating?: number, comment?: string) => {
    toast.success('Thank you for rating the driver! Your feedback helps us improve our service.');
    setIsRatingModalOpen(false);
    
    // Update the local rating status to immediately reflect the change
    if (rating) {
      markAsRated(rating, comment);
    }
  };

  const handleUpdateStatus = async (statusData: UpdateShipmentStatusRequest) => {
    try {
      if(!id ) return;
      await shipmentService.updateStatus(id, statusData);
      setIsUpdateStatusModalOpen(false);
      loadShipment();
    } catch (error: any) {
      const errorMessage = error.response?.data?.title || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to update status';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!shipment) {
    return (
      <Layout>
        <div className="text-center py-8 text-gray-500">Shipment not found</div>
      </Layout>
    );
  }

  if (!id) return null;


  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{shipment.trackingNumber}</h1>
            <p className="text-gray-600 mt-2">Shipment Details</p>
          </div>
          <div className="flex gap-2">
            {user?.role === 'Driver' && shipment.status != "Delivered" && shipment.status != "Cancelled" && shipment.assignedDriver?.id === user.id && (
              <Button onClick={() => setIsUpdateStatusModalOpen(true)}>Update Status</Button>
            )}
            {user?.role === 'Customer' && shipment.status === 'Delivered' && shipment.assignedDriver && (
              <>
                {!isLoadingRating && ratingStatus && !ratingStatus.isRated && ratingStatus.canBeRated && (
                  <Button 
                    onClick={() => setIsRatingModalOpen(true)}
                    className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700"
                  >
                    ⭐ Rate Driver
                  </Button>
                )}
                {!isLoadingRating && ratingStatus && ratingStatus.isRated && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                    <span>✓ Already Rated</span>
                    {ratingStatus.existingRating && (
                      <span>({ratingStatus.existingRating.rating}/5 ⭐)</span>
                    )}
                  </div>
                )}
                {!isLoadingRating && ratingStatus && !ratingStatus.canBeRated && (
                  <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                    {ratingStatus.ratingIneligibilityReason || 'Cannot be rated'}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Shipment Information">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <StatusBadge status={shipment.status} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Sender</p>
                  <p className="font-semibold">{shipment.sender.fullName}</p>
                  <p className="text-sm text-gray-500">{shipment.sender.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Receiver</p>
                  <p className="font-semibold">{shipment.receiverName}</p>
                  <p className="text-sm text-gray-500">{shipment.receiverEmail}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Origin Address</p>
                <p className="font-semibold">{shipment.originAddress}</p>
                {(shipment.originCity || shipment.originRegion) && (
                  <p className="text-sm text-gray-500">
                    {[shipment.originCity, shipment.originRegion].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">Destination Address</p>
                <p className="font-semibold">{shipment.destinationAddress}</p>
                {(shipment.destinationCity || shipment.destinationRegion) && (
                  <p className="text-sm text-gray-500">
                    {[shipment.destinationCity, shipment.destinationRegion].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
              {shipment.assignedDriver && (
                <div>
                  <p className="text-sm text-gray-600">Assigned Driver</p>
                  <p className="font-semibold">{shipment.assignedDriver.fullName}</p>
                  <p className="text-sm text-gray-500">{shipment.assignedDriver.email}</p>
                  {user?.role === 'Customer' && shipment.status === 'Delivered' && !isLoadingRating && (
                    <div className="mt-2">
                      {ratingStatus && !ratingStatus.isRated && ratingStatus.canBeRated && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            📝 Your package has been delivered! Please take a moment to rate your driver's service.
                          </p>
                        </div>
                      )}
                      {ratingStatus && ratingStatus.isRated && ratingStatus.existingRating && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800 font-medium">
                            ✓ You rated this delivery: {ratingStatus.existingRating.rating}/5 ⭐
                          </p>
                          {ratingStatus.existingRating.comment && (
                            <p className="text-sm text-green-700 mt-1">
                              "{ratingStatus.existingRating.comment}"
                            </p>
                          )}
                          <p className="text-xs text-green-600 mt-1">
                            Rated on {new Date(ratingStatus.existingRating.ratedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {ratingStatus && !ratingStatus.canBeRated && (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-sm text-gray-700">
                            {ratingStatus.ratingIneligibilityReason || 'This delivery cannot be rated at this time.'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Created At</p>
                  <p className="font-semibold">{new Date(shipment.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Updated At</p>
                  <p className="font-semibold">{new Date(shipment.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Tracking History">
            {shipment.trackingUpdates && shipment.trackingUpdates.length > 0 ? (
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
            ) : (
              <p className="text-gray-500 text-center py-4">No tracking updates yet</p>
            )}
          </Card>
        </div>



        <UpdateStatusModal
          isOpen={isUpdateStatusModalOpen}
          onClose={() => setIsUpdateStatusModalOpen(false)}
          onUpdate={handleUpdateStatus}
        />

        {shipment.assignedDriver && (
          <DriverRatingModal
            isOpen={isRatingModalOpen}
            onClose={() => setIsRatingModalOpen(false)}
            driverId={shipment.assignedDriver.id.toString()}
            driverName={shipment.assignedDriver.fullName}
            shipmentId={shipment.id.toString()}
            onRatingSubmitted={handleRatingSubmitted}
          />
        )}
      </div>
    </Layout>
  );
};

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: UpdateShipmentStatusRequest) => void;
}

const UpdateStatusModal = ({ isOpen, onClose, onUpdate }: UpdateStatusModalProps) => {
  const [formData, setFormData] = useState<UpdateShipmentStatusRequest>({
    status: 'PickedUp',
    location: '',
    remarks: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Shipment Status">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ShipmentStatus })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="PickedUp">Picked Up</option>
            <option value="InTransit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <Input
          label="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
          <textarea
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Update</Button>
        </div>
      </form>
    </Modal>
  );
};
