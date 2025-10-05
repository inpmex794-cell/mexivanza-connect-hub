import React from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { AdminTravelManager } from '@/components/travel/admin-travel-manager';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';

const SuperAdminDashboard: React.FC = () => {
  const { userRole } = useAuth();

  // Only allow super admins
  if (userRole !== 'super_admin') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <PageLayout>
      <AdminTravelManager />
    </PageLayout>
  );
};

export default SuperAdminDashboard;
import DestinationManager from '@/components/admin/DestinationManager';

return (
  <PageLayout>
    <DestinationManager />
  </PageLayout>
);
import SuperAdminDashboard from '@/pages/SuperAdminDashboard';

<Routes>
  <Route path="/super-admin" element={<SuperAdminDashboard />} />
</Routes>


