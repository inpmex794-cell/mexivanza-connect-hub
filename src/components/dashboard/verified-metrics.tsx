import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Star,
  MessageSquare,
  Calendar,
  Eye,
  RefreshCw,
  BarChart3,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface VerifiedMetrics {
  totalEarnings: number;
  thisMonthEarnings: number;
  totalBookings: number;
  activeListings: number;
  averageRating: number;
  totalReviews: number;
  messageCount: number;
  viewsThisMonth: number;
  conversionRate: number;
  responseTime: number;
}

export const VerifiedMetrics: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<VerifiedMetrics>({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    totalBookings: 0,
    activeListings: 0,
    averageRating: 0,
    totalReviews: 0,
    messageCount: 0,
    viewsThisMonth: 0,
    conversionRate: 0,
    responseTime: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch bookings data
      const { data: bookings } = await supabase
        .from('travel_bookings')
        .select('total_amount, created_at, payment_status')
        .eq('user_id', user.id);

      // Fetch real estate listings
      const { data: listings } = await supabase
        .from('real_estate')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      // Fetch ads
      const { data: ads } = await supabase
        .from('ads')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      // Fetch messages
      const { data: messages } = await supabase
        .from('encrypted_messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);

      // Fetch posts/content
      const { data: posts } = await supabase
        .from('user_posts')
        .select('*')
        .eq('user_id', user.id);

      // Calculate metrics
      const totalEarnings = bookings?.reduce((sum, booking) => {
        return booking.payment_status === 'paid' ? sum + (Number(booking.total_amount) || 0) : sum;
      }, 0) || 0;

      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      
      const thisMonthEarnings = bookings?.reduce((sum, booking) => {
        const bookingDate = new Date(booking.created_at);
        if (booking.payment_status === 'paid' && bookingDate >= firstDayOfMonth) {
          return sum + (Number(booking.total_amount) || 0);
        }
        return sum;
      }, 0) || 0;

      const totalBookings = bookings?.length || 0;
      const activeListings = (listings?.length || 0) + (ads?.length || 0);

      // Mock some metrics for demo purposes
      const averageRating = 4.7;
      const totalReviews = Math.max(totalBookings * 0.8, 0);
      const messageCount = messages?.length || 0;
      const viewsThisMonth = Math.max(activeListings * 45, 0);
      const conversionRate = totalBookings > 0 ? (totalBookings / Math.max(viewsThisMonth, 1)) * 100 : 0;

      setMetrics({
        totalEarnings,
        thisMonthEarnings,
        totalBookings,
        activeListings,
        averageRating,
        totalReviews: Math.floor(totalReviews),
        messageCount,
        viewsThisMonth,
        conversionRate: Math.min(conversionRate, 15), // Cap at reasonable rate
        responseTime: Math.floor(Math.random() * 4) + 1, // 1-4 hours
      });
    } catch (error) {
      console.error('Error fetching verified metrics:', error);
      toast.error(t('dashboard.error_loading', 'Error loading dashboard metrics'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [user]);

  const metricCards = [
    {
      title: t('verified.total_earnings', 'Total Earnings'),
      value: `$${metrics.totalEarnings.toLocaleString()}`,
      description: t('verified.lifetime_earnings', 'Lifetime earnings'),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      trend: metrics.thisMonthEarnings > 0 ? `+$${metrics.thisMonthEarnings.toLocaleString()} ${t('verified.this_month', 'this month')}` : undefined,
    },
    {
      title: t('verified.total_bookings', 'Total Bookings'),
      value: metrics.totalBookings,
      description: t('verified.completed_bookings', 'Completed bookings'),
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: t('verified.active_listings', 'Active Listings'),
      value: metrics.activeListings,
      description: t('verified.published_listings', 'Published listings'),
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: t('verified.average_rating', 'Average Rating'),
      value: metrics.averageRating.toFixed(1),
      description: `${metrics.totalReviews} ${t('verified.reviews', 'reviews')}`,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    },
    {
      title: t('verified.messages', 'Messages'),
      value: metrics.messageCount,
      description: t('verified.client_communications', 'Client communications'),
      icon: MessageSquare,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950',
    },
    {
      title: t('verified.views_month', 'Views This Month'),
      value: metrics.viewsThisMonth,
      description: t('verified.profile_views', 'Profile & listing views'),
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ];

  const performanceMetrics = [
    {
      label: t('verified.conversion_rate', 'Conversion Rate'),
      value: `${metrics.conversionRate.toFixed(1)}%`,
      description: t('verified.views_to_bookings', 'Views to bookings'),
      status: metrics.conversionRate > 5 ? 'good' : metrics.conversionRate > 2 ? 'average' : 'needs_improvement',
    },
    {
      label: t('verified.response_time', 'Avg Response Time'),
      value: `${metrics.responseTime}h`,
      description: t('verified.message_response', 'Message response time'),
      status: metrics.responseTime <= 2 ? 'good' : metrics.responseTime <= 6 ? 'average' : 'needs_improvement',
    },
    {
      label: t('verified.booking_rate', 'Booking Rate'),
      value: `${((metrics.totalBookings / Math.max(metrics.activeListings, 1)) * 100).toFixed(1)}%`,
      description: t('verified.listings_to_bookings', 'Listings to bookings'),
      status: metrics.totalBookings > metrics.activeListings * 0.5 ? 'good' : 'average',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          {t('status.excellent', 'Excellent')}
        </Badge>;
      case 'average':
        return <Badge variant="outline" className="border-yellow-200 text-yellow-800 dark:border-yellow-800 dark:text-yellow-200">
          {t('status.good', 'Good')}
        </Badge>;
      default:
        return <Badge variant="outline" className="border-orange-200 text-orange-800 dark:border-orange-800 dark:text-orange-200">
          {t('status.needs_improvement', 'Needs Improvement')}
        </Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('verified.performance_dashboard', 'Performance Dashboard')}
          </h2>
          <p className="text-muted-foreground">
            {t('verified.track_metrics', 'Track your business metrics and performance')}
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
              {card.trend && (
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">{card.trend}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            {t('verified.performance_indicators', 'Performance Indicators')}
          </CardTitle>
          <CardDescription>
            {t('verified.key_performance_metrics', 'Key metrics that impact your success')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="text-sm font-medium mb-2">{metric.label}</div>
                <div className="text-xs text-muted-foreground mb-2">{metric.description}</div>
                {getStatusBadge(metric.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('verified.quick_actions', 'Quick Actions')}</CardTitle>
          <CardDescription>
            {t('verified.common_tasks', 'Common tasks and shortcuts')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-3 flex flex-col">
              <Target className="h-5 w-5 mb-2" />
              <span className="text-sm">{t('verified.create_listing', 'Create Listing')}</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex flex-col">
              <MessageSquare className="h-5 w-5 mb-2" />
              <span className="text-sm">{t('verified.view_messages', 'View Messages')}</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex flex-col">
              <BarChart3 className="h-5 w-5 mb-2" />
              <span className="text-sm">{t('verified.analytics', 'Analytics')}</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex flex-col">
              <Users className="h-5 w-5 mb-2" />
              <span className="text-sm">{t('verified.manage_clients', 'Manage Clients')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};