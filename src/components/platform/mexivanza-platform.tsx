import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TravelHomepage } from '@/components/travel/travel-homepage';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';

export const MexivanzaPlatform: React.FC = () => {
  const { user, userRole, isAdmin, loading } = useAuth();

  // Admin redirection - mexivanza@mexivanza.com is sovereign admin
  if (!loading && (user?.email === 'mexivanza@mexivanza.com' || isAdmin)) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  // Verified user redirection
  if (!loading && user && userRole === 'verified') {
    return <Navigate to="/verified-dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <TravelHomepage />
      </div>
      <Footer />
    </div>
  );
};