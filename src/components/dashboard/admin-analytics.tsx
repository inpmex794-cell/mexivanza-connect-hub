import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Building,
  Plane,
  Scale,
  Monitor,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardMetrics {
  totalUsers: number;
  totalPosts: number;
  totalBusinesses: number;
  pendingModeration: number;
  revenueThisMonth: number;
  activeBookings: number;
  verifiedAgents: number;
  pendingVerifications: number;
}

export const AdminAnalytics: React.FC = () => {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    totalPosts: 0,
    totalBusinesses: 0,
    pendingModeration: 0,
    revenueThisMonth: 0,
    activeBookings: 0,
    verifiedAgents: 0,
    pendingVerifications: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);

      // Fetch user count from profiles table
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch posts count
      const { count: postsCount } = await supabase
        .from('user_posts')
        .select('*', { count: 'exact', head: true });

      // Fetch businesses count
      const { count: businessesCount } = await supabase
        .from('businesses')
        .select('*', { count: 'exact', head: true });

      // Fetch pending posts for moderation
      const { count: pendingCount } = await supabase
        .from('user_posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_ad', true)
        .eq('ad_status', 'pending');

      // Fetch active bookings
      const { count: bookingsCount } = await supabase
        .from('travel_bookings')
        .select('*', { count: 'exact', head: true })
        .in('booking_status', ['confirmed', 'pending']);

      // Fetch verified agents
      const { count: agentsCount } = await supabase
        .from('verified_agents')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'verified');

      // Fetch pending verifications
      const { count: pendingVerifications } = await supabase
        .from('verified_agents')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'pending');

      // Calculate revenue from bookings this month
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      
      const { data: bookingsData } = await supabase
        .from('travel_bookings')
        .select('total_amount')
        .eq('payment_status', 'paid')
        .gte('created_at', firstDayOfMonth.toISOString());

      const revenue = bookingsData?.reduce((sum, booking) => 
        sum + (Number(booking.total_amount) || 0), 0) || 0;

      setMetrics({
        totalUsers: userCount || 0,
        totalPosts: postsCount || 0,
        totalBusinesses: businessesCount || 0,
        pendingModeration: pendingCount || 0,
        revenueThisMonth: revenue,
        activeBookings: bookingsCount || 0,
        verifiedAgents: agentsCount || 0,
        pendingVerifications: pendingVerifications || 0,
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast.error(t('dashboard.error_loading', 'Error loading dashboard metrics'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const metricCards = [
    {
      title: t('admin.total_users', 'Total Users'),
      value: metrics.totalUsers,
      icon: Users,
      description: t('admin.registered_users', 'Registered users'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: t('admin.total_posts', 'Total Posts'),
      value: metrics.totalPosts,
      icon: FileText,
      description: t('admin.user_posts', 'User generated content'),
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: t('admin.businesses', 'Businesses'),
      value: metrics.totalBusinesses,
      icon: Building,
      description: t('admin.registered_businesses', 'Registered businesses'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: t('admin.revenue_month', 'Revenue (Month)'),
      value: `$${metrics.revenueThisMonth.toLocaleString()}`,
      icon: DollarSign,
      description: t('admin.monthly_revenue', 'This month\'s revenue'),
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: t('admin.active_bookings', 'Active Bookings'),
      value: metrics.activeBookings,
      icon: Plane,
      description: t('admin.current_bookings', 'Current active bookings'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
    {
      title: t('admin.verified_agents', 'Verified Agents'),
      value: metrics.verifiedAgents,
      icon: Scale,
      description: t('admin.certified_agents', 'Certified real estate agents'),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950',
    },
  ];

  const alertCards = [
    {
      title: t('admin.pending_moderation', 'Pending Moderation'),
      value: metrics.pendingModeration,
      description: t('admin.posts_need_review', 'Posts need review'),
      urgent: metrics.pendingModeration > 5,
    },
    {
      title: t('admin.pending_verifications', 'Pending Verifications'),
      value: metrics.pendingVerifications,
      description: t('admin.agents_awaiting_verification', 'Agents awaiting verification'),
      urgent: metrics.pendingVerifications > 3,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('admin.platform_analytics', 'Platform Analytics')}
          </h2>
          <p className="text-muted-foreground">
            {t('admin.real_time_metrics', 'Real-time platform metrics and insights')}
          </p>
        </div>
        <Button 
          onClick={fetchMetrics} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {t('button.refresh', 'Refresh')}
        </Button>
      </div>

      {/* Alert Cards */}
      {(alertCards.some(card => card.value > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alertCards.map((card, index) => (
            card.value > 0 && (
              <Card key={index} className={`border-l-4 ${card.urgent ? 'border-l-red-500 bg-red-50 dark:bg-red-950' : 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm font-medium">
                    <AlertCircle className={`h-4 w-4 mr-2 ${card.urgent ? 'text-red-600' : 'text-yellow-600'}`} />
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricCards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            {t('admin.platform_health', 'Platform Health')}
          </CardTitle>
          <CardDescription>
            {t('admin.key_performance_indicators', 'Key performance indicators')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {((metrics.verifiedAgents / Math.max(metrics.totalUsers, 1)) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                {t('admin.verification_rate', 'Verification Rate')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                {(metrics.totalPosts / Math.max(metrics.totalUsers, 1)).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('admin.posts_per_user', 'Posts per User')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">
                {((metrics.activeBookings / Math.max(metrics.totalUsers, 1)) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                {t('admin.booking_rate', 'Booking Rate')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">
                {metrics.revenueThisMonth > 0 ? (metrics.revenueThisMonth / metrics.activeBookings).toFixed(0) : '0'}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('admin.avg_booking_value', 'Avg Booking Value')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};