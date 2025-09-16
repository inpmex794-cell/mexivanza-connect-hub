import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TravelHomepage as TravelHomepageComponent } from '@/components/travel/travel-homepage';

export const TravelHomepage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <TravelHomepageComponent />
      </div>
      <Footer />
    </div>
  );
};