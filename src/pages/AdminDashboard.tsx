import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Package, Users, Truck, CheckCircle, TrendingUp } from 'lucide-react';
import { DashboardAnalytics } from '../types';
import { reportService } from '../services/report.service';

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await reportService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
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

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your logistics operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Shipments</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.totalShipments || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Shipments</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.activeShipments || 0}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.deliveredShipments || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.totalDrivers || 0}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Truck className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Shipments by Status">
            <div className="space-y-4">
              {analytics?.shipmentsByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.status}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{
                          width: `${(item.count / (analytics.totalShipments || 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Monthly Statistics">
            <div className="space-y-4">
              {analytics?.monthlyStats.slice(-6).map((item) => (
                <div key={item.month} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    {new Date(item.month).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-600 rounded-full"
                        style={{
                          width: `${(item.count / Math.max(...(analytics.monthlyStats.map(s => s.count) || [1]))) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card title="Quick Actions">
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => window.location.href = '/users'}>
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
            <Button onClick={() => window.location.href = '/shipments'}>
              <Package className="w-4 h-4 mr-2" />
              View All Shipments
            </Button>
            <Button onClick={() => window.location.href = '/reports'} variant="secondary">
              <TrendingUp className="w-4 h-4 mr-2" />
              Generate Reports
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
