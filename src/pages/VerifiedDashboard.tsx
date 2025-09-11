import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Plus, 
  MessageSquare, 
  Home, 
  DollarSign,
  FileText,
  Calendar,
  Map,
  Shield,
  TrendingUp,
  Briefcase,
  Settings
} from "lucide-react";

export const VerifiedDashboard: React.FC = () => {
  const { user, userRole } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    myPosts: 0,
    myListings: 0,
    messages: 0,
    earnings: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not verified user
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (userRole !== 'verified') {
      navigate('/dashboard');
      return;
    }
    
    fetchVerifiedUserData();
  }, [user, userRole, navigate]);

  const fetchVerifiedUserData = async () => {
    if (!user) return;

    try {
      // Fetch user's data and stats
      const [postsResponse, listingsResponse, messagesResponse] = await Promise.all([
        supabase.from('user_posts').select('*').eq('user_id', user.id),
        supabase.from('real_estate').select('*').eq('user_id', user.id),
        supabase.from('messages').select('*').eq('receiver_id', user.id)
      ]);

      setStats({
        myPosts: postsResponse.data?.length || 0,
        myListings: listingsResponse.data?.length || 0,
        messages: messagesResponse.data?.length || 0,
        earnings: 0 // Calculate based on business logic
      });

      // Set recent activity
      const activities = [
        ...(postsResponse.data?.slice(0, 3).map(post => ({
          type: 'post',
          title: post.title,
          date: post.created_at,
          status: post.ad_status
        })) || []),
        ...(listingsResponse.data?.slice(0, 2).map(listing => ({
          type: 'listing',
          title: listing.title,
          date: listing.created_at,
          status: listing.status
        })) || [])
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching verified user data:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const verifiedFeatures = [
    {
      title: t('verified.post_ads', 'Post Advertisements'),
      description: t('verified.post_ads_desc', 'Create and manage your ads'),
      icon: Plus,
      action: () => navigate('/create-ad'),
      color: 'text-green-500'
    },
    {
      title: t('verified.real_estate', 'Real Estate Listings'),
      description: t('verified.real_estate_desc', 'Manage property listings'),
      icon: Home,
      action: () => navigate('/my-listings'),
      color: 'text-blue-500'
    },
    {
      title: t('verified.encrypted_messaging', 'Encrypted Messaging'),
      description: t('verified.messaging_desc', 'Secure client communication'),
      icon: MessageSquare,
      action: () => navigate('/messages'),
      color: 'text-purple-500'
    },
    {
      title: t('verified.web_dev_intake', 'Web Dev Projects'),
      description: t('verified.web_dev_desc', 'Manage development projects'),
      icon: Briefcase,
      action: () => navigate('/projects'),
      color: 'text-orange-500'
    }
  ];

  // Show loading or redirect for non-verified users
  if (loading || !user || userRole !== 'verified') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">
            {loading ? 'Loading verified dashboard...' : 'Redirecting...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {t('verified.dashboard', 'Verified Dashboard')}
              </h1>
              <p className="text-muted-foreground">
                {t('verified.welcome', 'Welcome back, verified user')}
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Shield className="h-4 w-4 mr-1" />
              {t('verified.verified_status', 'Verified')}
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('verified.my_posts', 'My Posts')}</p>
                    <p className="text-2xl font-bold">{stats.myPosts}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('verified.my_listings', 'My Listings')}</p>
                    <p className="text-2xl font-bold">{stats.myListings}</p>
                  </div>
                  <Home className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('verified.messages', 'Messages')}</p>
                    <p className="text-2xl font-bold">{stats.messages}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('verified.earnings', 'Earnings')}</p>
                    <p className="text-2xl font-bold">${stats.earnings}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Verified Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('verified.verified_features', 'Verified Features')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {verifiedFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-4 p-6 border rounded-xl hover:bg-accent hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/20"
                    onClick={feature.action}
                  >
                    <div className="p-2 rounded-lg bg-accent group-hover:bg-background transition-colors">
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {t('verified.recent_activity', 'Recent Activity')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {activity.type === 'post' ? (
                          <FileText className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Home className="h-5 w-5 text-green-500" />
                        )}
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={activity.status === 'approved' ? 'default' : 'secondary'}
                        className={activity.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {t('verified.no_activity', 'No recent activity')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button 
              className="h-20 justify-start p-6 group hover:shadow-lg transition-all duration-200" 
              onClick={() => navigate('/create-post')}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary-foreground/10 group-hover:bg-primary-foreground/20 transition-colors">
                  <Plus className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-base">{t('verified.create_post', 'Create Post')}</div>
                  <div className="text-sm opacity-90 font-normal">{t('verified.share_content', 'Share your content')}</div>
                </div>
              </div>
            </Button>

            <Button 
              className="h-20 justify-start p-6 group hover:shadow-lg transition-all duration-200" 
              variant="outline" 
              onClick={() => navigate('/messages')}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-accent group-hover:bg-accent/70 transition-colors">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-base">{t('verified.view_messages', 'View Messages')}</div>
                  <div className="text-sm text-muted-foreground font-normal">{t('verified.client_communication', 'Client communication')}</div>
                </div>
              </div>
            </Button>

            <Button 
              className="h-20 justify-start p-6 group hover:shadow-lg transition-all duration-200" 
              variant="outline" 
              onClick={() => navigate('/settings')}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-accent group-hover:bg-accent/70 transition-colors">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-base">{t('verified.account_settings', 'Account Settings')}</div>
                  <div className="text-sm text-muted-foreground font-normal">{t('verified.manage_account', 'Manage your account')}</div>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};