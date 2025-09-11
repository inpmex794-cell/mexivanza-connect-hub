import React from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { AdminCategoriesManager } from '@/components/travel/admin-categories-manager';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';

const AdminCategoriesManagerPage: React.FC = () => {
  const { user } = useAuth();
  
  // Check if user is admin
  if (!user || user.email !== 'mexivanza@mexivanza.com') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <PageLayout>
      <AdminCategoriesManager />
    </PageLayout>
  );
};

export default AdminCategoriesManagerPage;