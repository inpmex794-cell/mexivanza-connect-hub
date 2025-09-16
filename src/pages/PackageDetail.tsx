import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PackageDetail as PackageDetailComponent } from '@/components/travel/package-detail';

export const PackageDetail: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <PackageDetailComponent />
      </div>
      <Footer />
    </div>
  );
};