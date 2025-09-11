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
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  FileText, 
  MessageSquare,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  Globe
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const { user, userRole, isAdmin } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    pendingModeration: 0,
    activeAgents: 0
  });
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not admin
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (user.email !== 'mexivanza@mexivanza.com' && userRole !== 'admin') {
      navigate('/');
      return;
    }
    
    fetchDashboardData();
  }, [user, userRole, navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch platform statistics
      const [usersResponse, postsResponse, pendingPostsResponse, agentsResponse] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('user_posts').select('id', { count: 'exact' }),
        supabase.from('user_posts').select('*').eq('ad_status', 'pending').limit(10),
        supabase.from('verified_agents').select('id', { count: 'exact' }).eq('is_active', true)
      ]);

      setStats({
        totalUsers: usersResponse.count || 0,
        totalPosts: postsResponse.count || 0,
        pendingModeration: pendingPostsResponse.data?.length || 0,
        activeAgents: agentsResponse.count || 0
      });

      setPendingPosts(pendingPostsResponse.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleModeratePost = async (postId: string, action: 'approve' | 'reject') => {
    try {
      const { error } = await supabase
        .from('user_posts')
        .update({ ad_status: action === 'approve' ? 'approved' : 'rejected' })
        .eq('id', postId);

      if (error) throw error;

      toast.success(`Post ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      fetchDashboardData();
    } catch (error) {
      console.error('Error moderating post:', error);
      toast.error('Error moderating post');
    }
  };

  const adminTools = [
    {
      title: t('admin.content_editor', 'Global Content Editor'),
      description: t('admin.content_desc', 'Edit platform content and modules'),
      icon: Edit,
      action: () => navigate('/home'),
      color: 'text-blue-500'
    },
    {
      title: t('admin.layout_manager', 'Layout Manager'),
      description: t('admin.layout_desc', 'Manage page layouts and components'),
      icon: Settings,
      action: () => navigate('/admin/layout'),
      color: 'text-green-500'
    },
    {
      title: t('admin.service_publisher', 'Service Publishing'),
      description: t('admin.service_desc', 'Publish and manage services'),
      icon: Globe,
      action: () => navigate('/admin/services'),
      color: 'text-purple-500'
    },
    {
      title: t('admin.verification', 'Verification Center'),
      description: t('admin.verification_desc', 'Manage user and agent verification'),
      icon: Shield,
      action: () => navigate('/admin/verification'),
      color: 'text-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
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
                {t('admin.dashboard', 'Admin Dashboard')}
              </h1>
              <p className="text-muted-foreground">
                {t('admin.welcome', 'Welcome back, Administrator')}
              </p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {t('admin.admin_access', 'Admin Access')}
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('admin.total_users', 'Total Users')}</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('admin.total_posts', 'Total Posts')}</p>
                    <p className="text-2xl font-bold">{stats.totalPosts}</p>
                  </div>
                  <FileText className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('admin.pending_moderation', 'Pending Moderation')}</p>
                    <p className="text-2xl font-bold">{stats.pendingModeration}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('admin.active_agents', 'Active Agents')}</p>
                    <p className="text-2xl font-bold">{stats.activeAgents}</p>
                  </div>
                  <Shield className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t('admin.admin_tools', 'Admin Tools')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adminTools.map((tool, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    onClick={tool.action}
                  >
                    <tool.icon className={`h-6 w-6 ${tool.color} mt-1`} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Moderation Queue */}
          {pendingPosts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {t('admin.moderation_queue', 'Moderation Queue')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingPosts.map((post) => (
                    <div key={post.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{post.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{post.category}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleModeratePost(post.id, 'approve')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleModeratePost(post.id, 'reject')}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button className="h-16 text-left" variant="outline" onClick={() => navigate('/admin/analytics')}>
              <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6" />
                <div>
                  <div className="font-semibold">{t('admin.view_analytics', 'View Analytics')}</div>
                  <div className="text-sm text-muted-foreground">{t('admin.platform_metrics', 'Platform metrics')}</div>
                </div>
              </div>
            </Button>

            <Button className="h-16 text-left" variant="outline" onClick={() => navigate('/admin/users')}>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6" />
                <div>
                  <div className="font-semibold">{t('admin.manage_users', 'Manage Users')}</div>
                  <div className="text-sm text-muted-foreground">{t('admin.user_management', 'User management')}</div>
                </div>
              </div>
            </Button>

            <Button className="h-16 text-left" variant="outline" onClick={() => navigate('/admin/content')}>
              <div className="flex items-center gap-3">
                <Edit className="h-6 w-6" />
                <div>
                  <div className="font-semibold">{t('admin.edit_content', 'Edit Content')}</div>
                  <div className="text-sm text-muted-foreground">{t('admin.content_management', 'Content management')}</div>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};