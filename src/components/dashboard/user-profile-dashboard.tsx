import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  MapPin, 
  Heart, 
  Bookmark,
  CreditCard,
  Settings,
  User,
  Plane,
  Building,
  MessageSquare,
  Star,
  TrendingUp,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface UserActivity {
  bookings: any[];
  savedItems: any[];
  posts: any[];
  transactions: any[];
  profile: any;
}

export const UserProfileDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activity, setActivity] = useState<UserActivity>({
    bookings: [],
    savedItems: [],
    posts: [],
    transactions: [],
    profile: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchUserActivity = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch bookings
      const { data: bookings } = await supabase
        .from('travel_bookings')
        .select(`
          *,
          travel_packages (title, description)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch user posts
      const { data: posts } = await supabase
        .from('user_posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Mock saved items and transactions for now
      const savedItems: any[] = [];
      const transactions: any[] = [];

      setActivity({
        bookings: bookings || [],
        savedItems,
        posts: posts || [],
        transactions,
        profile,
      });
    } catch (error) {
      console.error('Error fetching user activity:', error);
      toast.error(t('dashboard.error_loading', 'Error loading dashboard'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserActivity();
  }, [user]);

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          {t('booking.confirmed', 'Confirmed')}
        </Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-200 text-yellow-800 dark:border-yellow-800 dark:text-yellow-200">
          {t('booking.pending', 'Pending')}
        </Badge>;
      case 'cancelled':
        return <Badge variant="destructive">
          {t('booking.cancelled', 'Cancelled')}
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          {t('payment.paid', 'Paid')}
        </Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-orange-200 text-orange-800 dark:border-orange-800 dark:text-orange-200">
          {t('payment.pending', 'Pending')}
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={activity.profile?.avatar_url} />
            <AvatarFallback className="text-lg">
              {activity.profile?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t('dashboard.welcome_back', 'Welcome back')}, {activity.profile?.name || t('dashboard.user', 'User')}!
            </h1>
            <p className="text-muted-foreground">
              {t('dashboard.manage_account', 'Manage your account and track your activities')}
            </p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link to="/profile">
            <Settings className="h-4 w-4 mr-2" />
            {t('dashboard.account_settings', 'Account Settings')}
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.total_bookings', 'Total Bookings')}</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activity.bookings.length}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.lifetime_bookings', 'Lifetime bookings')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.my_posts', 'My Posts')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activity.posts.length}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.published_content', 'Published content')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.saved_items', 'Saved Items')}</CardTitle>
            <Bookmark className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activity.savedItems.length}</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.favorites', 'Favorite listings')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.account_status', 'Account Status')}</CardTitle>
            <User className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {activity.profile?.verification_status === 'verified' ? (
                <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {t('status.verified', 'Verified')}
                </Badge>
              ) : (
                <Badge variant="secondary">
                  {t('status.standard', 'Standard')}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plane className="h-5 w-5 mr-2" />
              {t('dashboard.recent_bookings', 'Recent Bookings')}
            </CardTitle>
            <CardDescription>
              {t('dashboard.your_travel_bookings', 'Your travel bookings and reservations')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activity.bookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">{t('dashboard.no_bookings', 'No bookings yet')}</p>
                <Button asChild variant="outline">
                  <Link to="/travel/categories">
                    {t('button.browse_packages', 'Browse Travel Packages')}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {activity.bookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-sm">
                          {booking.travel_packages?.title || t('booking.package', 'Travel Package')}
                        </h4>
                        {getBookingStatusBadge(booking.booking_status)}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{new Date(booking.travel_start_date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>${booking.total_amount}</span>
                        <span>•</span>
                        {getPaymentStatusBadge(booking.payment_status)}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {activity.bookings.length > 3 && (
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/dashboard/bookings">
                      {t('button.view_all_bookings', 'View All Bookings')}
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              {t('dashboard.my_content', 'My Content')}
            </CardTitle>
            <CardDescription>
              {t('dashboard.your_posts_activity', 'Your posts and community activity')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activity.posts.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">{t('dashboard.no_posts', 'No posts yet')}</p>
                <Button asChild variant="outline">
                  <Link to="/home">
                    {t('button.create_post', 'Create Your First Post')}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {activity.posts.slice(0, 3).map((post) => (
                  <div key={post.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{post.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{post.content}</p>
                  </div>
                ))}
                {activity.posts.length > 3 && (
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/dashboard/posts">
                      {t('button.view_all_posts', 'View All Posts')}
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.quick_actions', 'Quick Actions')}</CardTitle>
          <CardDescription>
            {t('dashboard.common_tasks', 'Common tasks and shortcuts')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col">
              <Link to="/travel/categories">
                <Plane className="h-6 w-6 mb-2" />
                <span className="text-sm">{t('dashboard.book_travel', 'Book Travel')}</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col">
              <Link to="/real-estate">
                <Building className="h-6 w-6 mb-2" />
                <span className="text-sm">{t('dashboard.browse_properties', 'Browse Properties')}</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col">
              <Link to="/directory">
                <MessageSquare className="h-6 w-6 mb-2" />
                <span className="text-sm">{t('dashboard.find_services', 'Find Services')}</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex flex-col">
              <Link to="/profile">
                <Settings className="h-6 w-6 mb-2" />
                <span className="text-sm">{t('dashboard.edit_profile', 'Edit Profile')}</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};