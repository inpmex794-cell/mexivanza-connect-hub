import React from 'react';
import { useAuth } from '@/hooks/use-auth';

interface ConditionalRenderProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireVerified?: boolean;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  requireAdmin = false,
  requireVerified = false,
  requireAuth = false,
  fallback = null
}) => {
  const { user, userRole, isAdmin } = useAuth();

  // Check if user is authenticated
  if (requireAuth && !user) {
    return <>{fallback}</>;
  }

  // Check if admin access is required
  if (requireAdmin && !isAdmin) {
    return <>{fallback}</>;
  }

  // Check if verified access is required
  if (requireVerified && userRole !== 'verified' && !isAdmin) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AdminOnly: React.FC<AdminOnlyProps> = ({ children, fallback = null }) => (
  <ConditionalRender requireAdmin fallback={fallback}>
    {children}
  </ConditionalRender>
);

interface VerifiedOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const VerifiedOnly: React.FC<VerifiedOnlyProps> = ({ children, fallback = null }) => (
  <ConditionalRender requireVerified fallback={fallback}>
    {children}
  </ConditionalRender>
);

interface AuthOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthOnly: React.FC<AuthOnlyProps> = ({ children, fallback = null }) => (
  <ConditionalRender requireAuth fallback={fallback}>
    {children}
  </ConditionalRender>
);

export const useRoleAccess = () => {
  const { user, userRole, isAdmin } = useAuth();

  return {
    isAuthenticated: !!user,
    isAdmin,
    isVerified: userRole === 'verified' || isAdmin,
    isUser: userRole === 'user',
    canAccessAdmin: isAdmin,
    canAccessVerified: userRole === 'verified' || isAdmin,
    currentRole: userRole
  };
};