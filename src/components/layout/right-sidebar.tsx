import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { WeatherWidget } from "@/components/modules/weather-widget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MessageCircle,
  TrendingUp,
  MapPin,
  Clock,
  Star,
  Users,
  Shield,
  Gamepad2,
  BarChart3,
  Plus
} from "lucide-react";

export const RightSidebar: React.FC = () => {
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();

  const quickStats = [
    { label: t("stats.services", "Services"), value: "3", icon: TrendingUp },
    { label: t("stats.regions", "Regions"), value: "4", icon: MapPin },
    { label: t("stats.online", "Online Now"), value: "24/7", icon: Clock },
  ];

  const recentActivity = [
    {
      action: t("activity.travel_inquiry", "Travel inquiry"),
      time: "2h ago",
      location: "Cancún",
    },
    {
      action: t("activity.legal_consultation", "Legal consultation"),
      time: "4h ago", 
      location: "Mexico City",
    },
    {
      action: t("activity.digital_service", "Digital service"),
      time: "1d ago",
      location: "Guadalajara",
    },
  ];

  const featuredServices = [
    {
      title: t("featured.travel_packages", "Travel Packages"),
      description: t("featured.travel_desc", "Explore Mexico with curated experiences"),
      badge: t("badge.popular", "Popular"),
    },
    {
      title: t("featured.legal_support", "Legal Support"),
      description: t("featured.legal_desc", "Professional legal assistance"),
      badge: t("badge.trusted", "Trusted"),
    },
    {
      title: t("featured.digital_solutions", "Digital Solutions"),
      description: t("featured.digital_desc", "Modern tech solutions for business"),
      badge: t("badge.new", "New"),
    },
  ];

  return (
    <div className="w-80 bg-card border-l border-border fixed right-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-6">
      
      {/* Weather Widget */}
      <WeatherWidget />

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t("stats.title", "Quick Stats")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t("stats.users", "Active Users")}
            </span>
            <Badge variant="secondary">2,453</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t("stats.posts", "Posts Today")}
            </span>
            <Badge variant="secondary">89</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t("stats.views", "Page Views")}
            </span>
            <Badge variant="secondary">15.2K</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Featured Services */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5" />
            {t("featured.title", "Featured Services")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
              <Gamepad2 className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground">
                  {t("featured.gaming", "Gaming Hub")}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {t("featured.gaming_desc", "Discover and share amazing games")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground">
                  {t("featured.agents", "Verified Agents")}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {t("featured.agents_desc", "Connect with certified real estate professionals")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
              <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground">
                  {t("featured.financial", "Stock Market")}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {t("featured.financial_desc", "Mexican market insights and analysis")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t("activity.title", "Recent Activity")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">
                {t("activity.new_user", "New user registered")}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">2m</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-muted-foreground">
                {t("activity.new_post", "New post published")}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">5m</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-muted-foreground">
                {t("activity.video_upload", "Video uploaded")}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">12m</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-muted-foreground">
                {t("activity.game_added", "New game added")}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">18m</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {user && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {t("actions.quick", "Quick Actions")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <MessageCircle className="mr-2 h-4 w-4" />
              {t("actions.create_post", "Create Post")}
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              {t("actions.schedule", "Schedule Event")}
            </Button>
            {isAdmin && (
              <>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  {t("actions.admin", "Admin Panel")}
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  {t("actions.analytics", "View Analytics")}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Contact */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {t("contact.quick_contact", "Quick Contact")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <WhatsAppButton
            message={t("whatsapp.general_inquiry", "Hello! I'm interested in Mexivanza services.")}
            className="w-full"
          >
            {t("contact.whatsapp", "WhatsApp")}
          </WhatsAppButton>
          <Button variant="outline" size="sm" className="w-full">
            <Calendar className="mr-2 h-4 w-4" />
            {t("contact.schedule", "Schedule Call")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};