import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className = "",
  showHeader = true,
  showFooter = true
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showHeader && <Header />}
      
      <main className={`flex-1 ${showHeader ? 'pt-16' : ''} ${className}`}>
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};