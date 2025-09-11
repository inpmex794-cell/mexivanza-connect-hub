import React from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { TravelCategoriesHub } from '@/components/travel/travel-categories-hub';

const TravelCategoriesPage: React.FC = () => {
  return (
    <PageLayout>
      <TravelCategoriesHub />
    </PageLayout>
  );
};

export default TravelCategoriesPage;