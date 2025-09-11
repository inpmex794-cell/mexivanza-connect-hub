import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { VerifiedMetrics } from "@/components/dashboard/verified-metrics";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Navigate } from "react-router-dom";

export const VerifiedDashboard: React.FC = () => {
  const { user, userRole, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">
            {t("dashboard.loading", "Loading dashboard...")}
          </p>
        </div>
      </div>
    );
  }

  // Redirect if not verified user
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (userRole !== 'verified') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <Shield className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">
                {t("verified.access_required", "Verified Access Required")}
              </h2>
              <p className="text-muted-foreground">
                {t("verified.verified_only", "This area is for verified users only.")}
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          <VerifiedMetrics />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};