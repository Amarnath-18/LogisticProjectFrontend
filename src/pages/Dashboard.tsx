import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { DriverDashboard } from './DriverDashboard';
import { CustomerDashboard } from './CustomerDashboard';

export const Dashboard = () => {
  const { user } = useAuth();

  // For debugging - show something even without user
  if (!user) {
    return null;
  }

  switch (user.role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Driver':
      return <DriverDashboard />;
    case 'Customer':
      return <CustomerDashboard />;
    default:
      return null;
  }
};
