import React from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { AdminTravelManager } from '@/components/travel/admin-travel-manager';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';

const AdminTravelManagerPage: React.FC = () => {
  const { user } = useAuth();
  
  // Check if user is admin (you may want to add proper role checking)
  if (!user || user.email !== 'inpmex794@gmail.com') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <PageLayout>
      <AdminTravelManager />
    </PageLayout>
  );
};

export default AdminTravelManagerPage;
