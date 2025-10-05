import React from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { AdminTravelManager } from '@/components/travel/admin-travel-manager';
import DestinationManager from '@/components/admin/DestinationManager';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';

export default function SuperAdminDashboard() {
  const { userRole } = useAuth();

  console.log("User role:", userRole);

  if (!userRole) {
    return <div>Loading user role...</div>;
  }

  if (userRole !== 'super_admin') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <PageLayout>
      <div className="space-y-10">
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <AdminTravelManager />
        <DestinationManager />
      </div>
    </PageLayout>
  );
}





