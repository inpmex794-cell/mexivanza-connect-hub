import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TravelBookingEngine } from '@/components/travel/travel-booking-engine';

export const TravelBooking: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 pb-16">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <TravelBookingEngine />
        </div>
      </div>
      <Footer />
    </div>
  );
};