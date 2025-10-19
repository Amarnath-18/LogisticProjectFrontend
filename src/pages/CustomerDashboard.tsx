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
import { Package, Plus, Clock, CheckCircle } from 'lucide-react';

export const CustomerDashboard = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const activeShipments = shipments.filter(
    (s) => s.status !== 'Delivered' && s.status !== 'Cancelled'
  );
  const deliveredShipments = shipments.filter((s) => s.status === 'Delivered');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
            <p className="text-gray-600 mt-2">Track and manage your shipments</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Shipment
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Shipments</p>
                <p className="text-2xl font-bold text-gray-900">{shipments.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">{activeShipments.length}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{deliveredShipments.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        <Card title="Your Shipments">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receiver
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                        <div className="text-sm font-medium text-blue-600">
                          {shipment.trackingNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{shipment.receiverName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{shipment.destinationAddress}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={shipment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/shipments/${shipment.id}`}>
                          <Button size="sm">Track</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {shipments.length === 0 && (
                <div className="text-center py-8 text-gray-500">No shipments yet</div>
              )}
            </div>
          )}
        </Card>

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
