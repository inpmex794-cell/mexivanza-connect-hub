import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BusinessMicrositeBuilder } from '@/components/business/business-microsite-builder';

export const BusinessBuilder: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 pb-16">
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          <BusinessMicrositeBuilder />
        </div>
      </div>
      <Footer />
    </div>
  );
};