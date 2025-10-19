import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, LogOut, User, BarChart3, Users, Home } from 'lucide-react';
import { Button } from './Button';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Package className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">LogisticTracker</span>
              </Link>

              {user && (
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>

                  {user.role === 'Admin' && (
                    <>
                      <Link
                        to="/users"
                        className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                      >
                        <Users className="w-4 h-4" />
                        <span>Users</span>
                      </Link>
                      <Link
                        to="/reports"
                        className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>Reports</span>
                      </Link>
                    </>
                  )}

                  <Link
                    to="/shipments"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    <span>Shipments</span>
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 font-medium">{user.fullName}</span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </div>
                  <Button variant="secondary" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button size="sm">Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
};
