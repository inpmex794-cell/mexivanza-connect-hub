import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardHome } from './pages/DashboardHome';
import { TripsPage } from './pages/TripsPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { TagsPage } from './pages/TagsPage';
import { PagesPage } from './pages/PagesPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { ServicesPage } from './pages/ServicesPage';
import { BookingsPage } from './pages/BookingsPage';
import { MediaPage } from './pages/MediaPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';

export default function DashboardRouter() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route index element={<DashboardHome />} />
                  <Route path="trips" element={<TripsPage />} />
                  <Route path="destinations" element={<DestinationsPage />} />
                  <Route path="categories" element={<CategoriesPage />} />
                  <Route path="tags" element={<TagsPage />} />
                  <Route path="pages" element={<PagesPage />} />
                  <Route path="features" element={<FeaturesPage />} />
                  <Route path="services" element={<ServicesPage />} />
                  <Route path="bookings" element={<BookingsPage />} />
                  <Route path="media" element={<MediaPage />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}