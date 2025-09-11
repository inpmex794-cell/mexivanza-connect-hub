import React from 'react';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { Footer } from '@/components/layout/footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Three-column layout */}
      <div className="pt-16 min-h-screen bg-muted/30">
        <div className="max-w-7xl mx-auto flex">
          {/* Left Sidebar - Fixed Navigation */}
          <Sidebar />
          
          {/* Center Feed - Main Content */}
          <main className="flex-1 min-h-screen bg-background ml-64 mr-80 overflow-hidden">
            <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6 container-safe">
              {children}
            </div>
          </main>
          
          {/* Right Sidebar - Contextual modules */}
          <RightSidebar />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};