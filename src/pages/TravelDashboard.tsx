import React from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { UserTravelDashboard } from '@/components/travel/user-travel-dashboard';

const TravelDashboardPage: React.FC = () => {
  return (
    <PageLayout>
      <UserTravelDashboard />
    </PageLayout>
  );
};

export default TravelDashboardPage;