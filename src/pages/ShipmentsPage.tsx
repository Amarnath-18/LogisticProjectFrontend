import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Shipment, CreateShipmentRequest } from '../types';
import { shipmentService } from '../services/shipment.service';
import { useAuth } from '../context/AuthContext';
import { Plus, Eye } from 'lucide-react';

export const ShipmentsPage = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      const data = await shipmentService.getAllShipments();
      setShipments(data);
    } catch (error) {
      console.error('Failed to load shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShipment = async (formData: CreateShipmentRequest) => {
    try {
      await shipmentService.createShipment(formData);
      setIsCreateModalOpen(false);
      loadShipments();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create shipment');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipments</h1>
            <p className="text-gray-600 mt-2">Manage and track all shipments</p>
          </div>
          {(user?.role === 'Customer' || user?.role === 'Admin') && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Shipment
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receiver
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Driver
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">{shipment.trackingNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{shipment.sender.fullName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{shipment.receiverName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={shipment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {shipment.assignedDriver?.fullName || 'Not assigned'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(shipment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/shipments/${shipment.id}`}>
                          <Button size="sm" variant="secondary">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {shipments.length === 0 && (
                <div className="text-center py-8 text-gray-500">No shipments found</div>
              )}
            </div>
          </Card>
        )}

        <CreateShipmentModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateShipment}
        />
      </div>
    </Layout>
  );
};

interface CreateShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateShipmentRequest) => void;
}

const CreateShipmentModal = ({ isOpen, onClose, onCreate }: CreateShipmentModalProps) => {
  const [formData, setFormData] = useState<CreateShipmentRequest>({
    receiverName: '',
    receiverEmail: '',
    receiverPhone: '',
    originAddress: '',
    destinationAddress: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Shipment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Receiver Name"
          value={formData.receiverName}
          onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
          required
        />
        <Input
          label="Receiver Email"
          type="email"
          value={formData.receiverEmail}
          onChange={(e) => setFormData({ ...formData, receiverEmail: e.target.value })}
          required
        />
        <Input
          label="Receiver Phone"
          type="tel"
          value={formData.receiverPhone}
          onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })}
        />
        <Input
          label="Origin Address"
          value={formData.originAddress}
          onChange={(e) => setFormData({ ...formData, originAddress: e.target.value })}
          required
        />
        <Input
          label="Destination Address"
          value={formData.destinationAddress}
          onChange={(e) => setFormData({ ...formData, destinationAddress: e.target.value })}
          required
        />
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Shipment</Button>
        </div>
      </form>
    </Modal>
  );
};
