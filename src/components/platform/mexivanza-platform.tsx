import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { MainFeed } from '@/components/feed/main-feed';
import { RightSidebar } from '@/components/layout/right-sidebar';
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
      {/* Sticky Header */}
      <Header />
      
      {/* Three-Column Layout */}
      <div className="pt-16 min-h-screen bg-muted/30">
        <div className="max-w-7xl mx-auto flex">
          {/* Left Sidebar - Navigation */}
          <LeftSidebar />
          
          {/* Center Feed - Main Content */}
          <MainFeed />
          
          {/* Right Sidebar - Contextual Modules */}
          <RightSidebar />
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};