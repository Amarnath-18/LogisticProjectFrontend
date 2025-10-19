import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { CreateShipmentForm } from '../components/CreateShipmentForm';
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
  console.log(shipments);
  
  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Customer Dashboard</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Track and manage your shipments</p>
          </div>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Create Shipment</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600">Total Shipments</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{shipments.length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600">In Transit</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{activeShipments.length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg flex-shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{deliveredShipments.length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
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
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
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
              </div>

              {/* Mobile Card Layout */}
              <div className="md:hidden space-y-4">
                {shipments.map((shipment) => (
                  <div key={shipment.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-blue-600 truncate">
                          {shipment.trackingNumber}
                        </h4>
                        <div className="mt-1">
                          <StatusBadge status={shipment.status} />
                        </div>
                      </div>
                      <Link to={`/shipments/${shipment.id}`} className="ml-3">
                        <Button size="sm">Track</Button>
                      </Link>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Receiver: </span>
                        <span className="text-gray-900">{shipment.receiverName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">To: </span>
                        <span className="text-gray-900">{shipment.destinationAddress}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {shipments.length === 0 && (
                <div className="text-center py-8 text-gray-500">No shipments yet</div>
              )}
            </>
          )}
        </Card>

        <CreateShipmentForm
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateShipment}
        />
      </div>
    </Layout>
  );
};


