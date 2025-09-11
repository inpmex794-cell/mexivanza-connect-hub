import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Users, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Shield,
  Globe,
  Package,
  Scale,
  Monitor,
  Map,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  const adminStats = [
    { icon: Users, value: '2,847', label: 'Total Users', change: '+12%' },
    { icon: FileText, value: '156', label: 'Pending Ads', change: '+8%' },
    { icon: Package, value: '24', label: 'Travel Packages', change: '0%' },
    { icon: Shield, value: '89', label: 'Verifications', change: '+15%' },
  ];

  const recentActivity = [
    { type: 'user_signup', message: 'New user registered: juan@example.com', time: '2 min ago' },
    { type: 'ad_submission', message: 'Ad submitted for review: Casa en Cancún', time: '5 min ago' },
    { type: 'verification', message: 'Business verification approved: Hotel Plaza', time: '12 min ago' },
    { type: 'booking', message: 'New travel booking: Tulum Package', time: '18 min ago' },
  ];

  const serviceModules = [
    {
      icon: Package,
      title: 'Travel Packages',
      description: 'Manage travel offerings',
      count: '24 active',
      action: 'Manage',
      href: '/admin/travel'
    },
    {
      icon: Scale,
      title: 'Legal Services',
      description: 'Legal offerings & consultations',
      count: '12 services',
      action: 'Manage',
      href: '/admin/legal'
    },
    {
      icon: Monitor,
      title: 'Web Development',
      description: 'Digital service offerings',
      count: '8 packages',
      action: 'Manage',
      href: '/admin/webdev'
    },
    {
      icon: Map,
      title: 'Real Estate',
      description: 'Property management',
      count: '156 listings',
      action: 'Manage',
      href: '/admin/realestate'
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.email}
            </p>
          </div>
          <Badge variant="default" className="bg-primary">
            <Shield className="mr-1 h-3 w-3" />
            Administrator
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {adminStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <stat.icon className="h-8 w-8 text-primary mb-2" />
                    <Badge variant={stat.change.startsWith('+') ? 'default' : 'secondary'}>
                      {stat.change}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest platform activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Administrative shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-20 flex-col">
                      <PlusCircle className="h-6 w-6 mb-2" />
                      Create Package
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <FileText className="h-6 w-6 mb-2" />
                      Review Ads
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Shield className="h-6 w-6 mb-2" />
                      Verifications
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <BarChart3 className="h-6 w-6 mb-2" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {serviceModules.map((module, index) => (
                <Card key={index} className="hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <module.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{module.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                          <Badge variant="secondary">{module.count}</Badge>
                        </div>
                      </div>
                      <Button size="sm">{module.action}</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and roles</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  User management interface will be implemented here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Global content editor and moderation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Content management tools will be implemented here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure global platform settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Platform configuration options will be implemented here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};