import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminAnalytics } from "@/components/dashboard/admin-analytics";
import { UserManagement } from "@/components/dashboard/user-management";
import { ContentModeration } from "@/components/dashboard/content-moderation";
import { BusinessApproval } from "@/components/admin/business-approval";
import { PaymentSettings } from "@/components/admin/payment-settings";
import { VideoModeration } from "@/components/admin/video-moderation";
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
          <TabsList className="grid w-full grid-cols-5">
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
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t("admin.business", "Business")}
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

          <TabsContent value="business">
            <BusinessApproval />
          </TabsContent>

          <TabsContent value="settings">
            <Tabs defaultValue="payment" className="space-y-4">
              <TabsList>
                <TabsTrigger value="payment" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t("admin.payment_settings", "Payment")}
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {t("admin.video_moderation", "Video")}
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  {t("admin.security_settings", "Security")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="payment">
                <PaymentSettings />
              </TabsContent>

              <TabsContent value="video">
                <VideoModeration />
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {t("admin.security_settings", "Security Settings")}
                    </CardTitle>
                    <CardDescription>
                      {t("admin.security_desc", "Manage platform security and access controls")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-dashed">
                        <CardContent className="pt-6 text-center">
                          <Shield className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                          <h3 className="font-medium mb-2">{t("admin.rls_policies", "RLS Policies")}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {t("admin.rls_desc", "Row-level security policies active")}
                          </p>
                          <div className="text-green-600 text-sm">✓ {t("status.active", "Active")}</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-dashed">
                        <CardContent className="pt-6 text-center">
                          <Settings className="h-8 w-8 text-green-500 mx-auto mb-4" />
                          <h3 className="font-medium mb-2">{t("admin.auth_settings", "Authentication")}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {t("admin.auth_desc", "User authentication and session management")}
                          </p>
                          <div className="text-green-600 text-sm">✓ {t("status.configured", "Configured")}</div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};