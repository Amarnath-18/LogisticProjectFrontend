import { Layout } from '../components/Layout';
import { UserProfileManagement } from '../components/UserProfileManagement';
import { DriverProfileManagement } from '../components/DriverProfileManagement';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-8 text-gray-500">
          Please log in to view your profile.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* General User Profile Management */}
        <UserProfileManagement user={user} />

        {/* Driver-specific Profile Management */}
        {user.role === 'Driver' && (
          <div className="pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Driver Settings</h2>
            <DriverProfileManagement />
          </div>
        )}
      </div>
    </Layout>
  );
};