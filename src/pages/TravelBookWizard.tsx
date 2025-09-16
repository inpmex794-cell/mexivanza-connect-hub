import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { EnhancedBookingWizard } from '@/components/travel/enhanced-booking-wizard';

export const TravelBookWizard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <EnhancedBookingWizard />
      </main>
      <Footer />
    </div>
  );
};