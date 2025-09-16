import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BookingConfirmation } from '@/components/travel/booking-confirmation';

export const BookingConfirmationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <BookingConfirmation />
      </main>
      <Footer />
    </div>
  );
};