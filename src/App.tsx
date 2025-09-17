import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/use-auth';
import { LanguageProvider } from '@/hooks/use-language';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RoleBasedRouter } from '@/components/routing/role-based-router';
import { MexivanzaPlatform } from '@/components/platform/mexivanza-platform';
import { Home } from '@/pages/Home';
import { Auth } from '@/pages/Auth';
import { UserLogin } from '@/pages/UserLogin';
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
import { BusinessDirectoryPage } from '@/pages/BusinessDirectory';
import TravelCategories from '@/pages/TravelCategories';
import { VideoFeed } from '@/pages/VideoFeed';
import { TravelBooking } from '@/pages/TravelBooking';
import { BusinessBuilder } from '@/pages/BusinessBuilder';
import AdminCategoriesManager from '@/pages/AdminCategoriesManager';
import { TravelHomepage } from '@/components/travel/TravelHomepage';
import { TravelPackages } from '@/components/travel/TravelPackages';
import { TravelBookingWizard } from '@/components/travel/TravelBookingWizard';
import { PackageDetail } from '@/pages/PackageDetail';
import { BookingConfirmationPage } from '@/pages/BookingConfirmation';
import { UserDashboard } from '@/pages/UserDashboard';
import { AccountBookings } from '@/pages/AccountBookings';
import NotFound from '@/pages/NotFound';
import DashboardRouter from './dashboard/DashboardRouter';

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
                  {/* Public landing page - now uses complete platform */}
                  <Route path="/" element={<MexivanzaPlatform />} />
                  
                  {/* Role-based routing for authenticated users */}
                  <Route path="/dashboard-redirect" element={<RoleBasedRouter />} />
                  
                  {/* Public Routes */}
                  <Route path="/home" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/login" element={<UserLogin />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/companies" element={<Companies />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/travel" element={<TravelHomepage />} />
                  <Route path="/travel/packages" element={<TravelPackages />} />
                  <Route path="/travel/categories" element={<TravelCategories />} />
                  <Route path="/travel/package/:packageId" element={<PackageDetail />} />
                  <Route path="/travel/book/:packageId" element={<TravelBookingWizard />} />
                  <Route path="/travel/booking-confirmation/:bookingId" element={<BookingConfirmationPage />} />
                  <Route path="/account" element={<UserDashboard />} />
                  <Route path="/account/bookings" element={<AccountBookings />} />
                  <Route path="/travel/booking" element={<TravelBooking />} />
                  <Route path="/videos" element={<VideoFeed />} />
                  <Route path="/business-builder" element={<BusinessBuilder />} />
                  <Route path="/business-directory" element={<BusinessDirectoryPage />} />
                  <Route path="/businesses" element={<BusinessDirectoryPage />} />
                  
                  {/* Admin Dashboard */}
                  <Route path="/dashboard/*" element={<DashboardRouter />} />
                  
                  {/* Protected Routes */}
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/verified-dashboard" element={<VerifiedDashboard />} />
                  <Route path="/admin/travel-categories" element={<AdminCategoriesManager />} />
                  
                  {/* Service Routes */}
                  <Route path="/legal" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/real-estate" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/web-development" element={<Navigate to="/dashboard" replace />} />
                  
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
