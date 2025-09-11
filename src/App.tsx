import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/use-auth';
import { LanguageProvider } from '@/hooks/use-language';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RoleBasedRouter } from '@/components/routing/role-based-router';
import { Home } from '@/pages/Home';
import { Auth } from '@/pages/Auth';
import { Dashboard } from '@/pages/Dashboard';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { VerifiedDashboard } from '@/pages/VerifiedDashboard';
import { Privacy } from '@/pages/Privacy';
import { Terms } from '@/pages/Terms';
import { Contact } from '@/pages/Contact';
import { About } from '@/pages/About';
import { Companies } from '@/pages/Companies';
import { Careers } from '@/pages/Careers';
import { Blog } from '@/pages/Blog';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Routes>
                  {/* Role-based root routing */}
                  <Route path="/" element={<RoleBasedRouter />} />
                  
                  {/* Public Routes */}
                  <Route path="/home" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/companies" element={<Companies />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/blog" element={<Blog />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/verified-dashboard" element={<VerifiedDashboard />} />
                  
                  {/* Fallback */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
                <Toaster />
                <Sonner />
              </div>
            </Router>
          </AuthProvider>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
