import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Package, Users, Truck, CheckCircle, TrendingUp } from 'lucide-react';
import { DashboardAnalytics } from '../types';
import { reportService } from '../services/report.service';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate  = useNavigate();

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
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Overview of your logistics operations</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600">Total Shipments</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{analytics?.totalShipments || 0}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600">Active Shipments</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{analytics?.activeShipments || 0}</p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg flex-shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{analytics?.deliveredShipments || 0}</p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600">Total Drivers</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{analytics?.totalDrivers || 0}</p>
              </div>
              <div className="p-2 sm:p-3 bg-orange-100 rounded-lg flex-shrink-0">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card title="Shipments by Status">
            <div className="space-y-3 sm:space-y-4">
              {analytics?.shipmentsByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-700 min-w-0 flex-shrink-0">{item.status}</span>
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden min-w-0">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{
                          width: `${(item.count / (analytics.totalShipments || 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 flex-shrink-0 w-6 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Monthly Statistics">
            <div className="space-y-3 sm:space-y-4">
              {analytics?.monthlyStats.slice(-6).map((item) => (
                <div key={item.month} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-700 min-w-0 flex-shrink-0">
                    {new Date(item.month).toLocaleDateString('en-US', {
                      year: '2-digit',
                      month: 'short',
                    })}
                  </span>
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden min-w-0">
                      <div
                        className="h-full bg-green-600 rounded-full transition-all duration-300"
                        style={{
                          width: `${(item.count / Math.max(...(analytics.monthlyStats.map(s => s.count) || [1]))) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 flex-shrink-0 w-6 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card title="Quick Actions">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Button 
              onClick={() => navigate('/users')}
              className="w-full sm:w-auto justify-center sm:justify-start"
            >
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Manage Users</span>
              <span className="sm:hidden">Users</span>
            </Button>
            <Button 
              onClick={() => navigate('/shipments')}
              className="w-full sm:w-auto justify-center sm:justify-start"
            >
              <Package className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">View All Shipments</span>
              <span className="sm:hidden">Shipments</span>
            </Button>
            <Button 
              onClick={() =>navigate('/reports')} 
              variant="secondary"
              className="w-full sm:w-auto justify-center sm:justify-start"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Generate Reports</span>
              <span className="sm:hidden">Reports</span>
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
