import { ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, LogOut, User, BarChart3, Users, Home, Menu, X, Settings } from 'lucide-react';
import { Button } from './Button';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Package className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900 hidden sm:block">LogisticTracker</span>
                <span className="text-lg font-bold text-gray-900 sm:hidden">LT</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {user && (
              <div className="hidden md:flex items-center space-x-4">
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

                <Link
                  to="/profile"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
              </div>
            )}

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 font-medium hidden lg:block">{user.fullName}</span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </div>
                  <Button className='flex items-center justify-center' variant="secondary" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 lg:mr-1" />
                    <span className="hidden lg:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button size="sm">Login</Button>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            {user && (
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu */}
          {user && isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                <Link
                  to="/"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>

                {user.role === 'Admin' && (
                  <>
                    <Link
                      to="/users"
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Users className="w-5 h-5" />
                      <span>Users</span>
                    </Link>
                    <Link
                      to="/reports"
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span>Reports</span>
                    </Link>
                  </>
                )}

                <Link
                  to="/shipments"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Package className="w-5 h-5" />
                  <span>Shipments</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span>Profile</span>
                </Link>

                {/* Mobile user section */}
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-3">
                    <div className="flex-shrink-0">
                      <User className="w-8 h-8 text-gray-500" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{user.fullName}</div>
                      <div className="text-sm text-gray-500">{user.role}</div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">{children}</main>
    </div>
  );
};
