import React from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { TravelPackages } from '@/components/travel/travel-packages';

const TravelPackagesPage: React.FC = () => {
  return (
    <PageLayout>
      <TravelPackages />
    </PageLayout>
  );
};

export default TravelPackagesPage;