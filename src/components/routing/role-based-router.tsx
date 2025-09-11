import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';

export const RoleBasedRouter: React.FC = () => {
  const { user, userRole, isAdmin, loading } = useAuth();
  const { language } = useLanguage();

  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">
            {language === 'es' ? 'Cargando...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Admin routing - mexivanza@mexivanza.com gets admin access
  if (user?.email === 'mexivanza@mexivanza.com' || isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  // Verified user routing
  if (user && userRole === 'verified') {
    return <Navigate to="/verified-dashboard" replace />;
  }

  // Authenticated user routing (basic user)
  if (user && userRole === 'user') {
    return <Navigate to="/dashboard" replace />;
  }

  // Public/unauthenticated routing
  return <Navigate to="/" replace />;
};