import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminAnalytics } from "@/components/dashboard/admin-analytics";
import { UserManagement } from "@/components/dashboard/user-management";
import { ContentModeration } from "@/components/dashboard/content-moderation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Navigate } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  Shield, 
  Settings,
  UserCheck,
  Crown,
  Zap
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("analytics");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Enforce admin sovereignty - only mexivanza@mexivanza.com or admin role
  if (!user || (!isAdmin && user.email !== 'mexivanza@mexivanza.com')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Admin Header */}
      <div className="pt-16 bg-gradient-to-r from-primary to-primary-hover text-primary-foreground p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Crown className="h-8 w-8" />
                {t("admin.dashboard", "Admin Dashboard")}
              </h1>
              <p className="opacity-90 mt-2">
                {t("admin.platform_control", "Complete platform control and management")}
              </p>
            </div>
            <div className="bg-red-500/20 px-4 py-2 rounded-lg flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">{t("admin.sovereign_access", "Sovereign Access")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t("admin.analytics", "Analytics")}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t("admin.users", "Users")}
            </TabsTrigger>
            <TabsTrigger value="moderation" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              {t("admin.moderation", "Moderation")}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {t("admin.settings", "Settings")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="moderation">
            <ContentModeration />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {t("admin.platform_settings", "Platform Settings")}
                </CardTitle>
                <CardDescription>
                  {t("admin.configure_platform", "Configure platform-wide settings and preferences")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-dashed">
                    <CardContent className="pt-6 text-center">
                      <Shield className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                      <h3 className="font-medium mb-2">{t("admin.security_settings", "Security Settings")}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t("admin.security_desc", "Manage authentication and security policies")}
                      </p>
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
                        {t("button.configure", "Configure")}
                      </button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-dashed">
                    <CardContent className="pt-6 text-center">
                      <BarChart3 className="h-8 w-8 text-green-500 mx-auto mb-4" />
                      <h3 className="font-medium mb-2">{t("admin.payment_settings", "Payment Settings")}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t("admin.payment_desc", "Configure payment gateways and billing")}
                      </p>
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
                        {t("button.manage", "Manage")}
                      </button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};