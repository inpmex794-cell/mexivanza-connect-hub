import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { UserBookingsDashboard } from '@/components/travel/user-bookings-dashboard';

export const AccountBookings: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <UserBookingsDashboard />
      </main>
      <Footer />
    </div>
  );
};