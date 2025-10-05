import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/use-auth';
import { LanguageProvider } from '@/hooks/use-language';
import { ThemeProvider } from '@/hooks/use-theme';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { RoleBasedRouter } from '@/components/routing/role-based-router';
import { MexivanzaPlatform } from '@/components/platform/mexivanza-platform';

// Pages
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
import SuperAdminDashboard from '@/pages/SuperAdminDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <AuthProvider>
              <Router>
                <div className="min-h-screen bg-background">
                  <Routes>
                    {/* Public landing page */}
                    <Route path="/" element={<MexivanzaPlatform />} />

                    {/* Auth routes */}
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/login" element={<UserLogin />} />

                    {/* Public pages */}
                    <Route path="/home" element={<Home />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/companies" element={<Companies />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/videos" element={<VideoFeed />} />

                    {/* Travel pages */}
                    <Route path="/travel" element={<TravelHomepage />} />
                    <Route path="/travel/packages" element={<TravelPackages />} />
                    <Route path="/travel/categories" element={<TravelCategories />} />
                    <Route path="/travel/package/:packageId" element={<PackageDetail />} />
                    <Route path="/travel/book/:packageId" element={<TravelBookingWizard />} />
                    <Route path="/travel/booking-confirmation/:bookingId" element={<BookingConfirmationPage />} />
                    <Route path="/travel/booking" element={<TravelBooking />} />

                    {/* Business pages */}
                    <Route path="/business-builder" element={<BusinessBuilder />} />
                    <Route path="/business-directory" element={<BusinessDirectoryPage />} />
                    <Route path="/businesses" element={<BusinessDirectoryPage />} />

                    {/* User account pages */}
                    <Route path="/account" element={<UserDashboard />} />
                    <Route path="/account/bookings" element={<AccountBookings />} />

                    {/* Admin and dashboard routes */}
                    <Route path="/dashboard/*" element={<DashboardRouter />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/verified-dashboard" element={<VerifiedDashboard />} />
                    <Route path="/admin/travel-categories" element={<AdminCategoriesManager />} />

                    {/* Super Admin Dashboard */}
                    <Route path="/super-admin" element={<SuperAdminDashboard />} />

                    {/* Role-based redirect */}
                    <Route path="/dashboard-redirect" element={<RoleBasedRouter />} />

                    {/* Service redirects */}
                    <Route path="/legal" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/real-estate" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/web-development" element={<Navigate to="/dashboard" replace />} />

                    {/* Fallback routes */}
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
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

