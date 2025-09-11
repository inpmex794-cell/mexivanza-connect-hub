import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MessageCircle,
  TrendingUp,
  MapPin,
  Clock,
  Star,
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
    <div className="p-4 space-y-6">
      {/* Quick Contact */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              {t("contact.quick_contact", "Quick Contact")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <WhatsAppButton
              message={t("whatsapp.general_inquiry", "Hello! I'm interested in Mexivanza services.")}
              className="w-full"
            >
              {t("contact.whatsapp", "WhatsApp")}
            </WhatsAppButton>
            <Button variant="outline" className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              {t("contact.schedule", "Schedule Call")}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t("stats.title", "Quick Stats")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <stat.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                  <span className="font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t("activity.title", "Recent Activity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.action}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="mr-1 h-3 w-3" />
                      {activity.location} • {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Featured Services */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Star className="mr-2 h-5 w-5" />
              {t("featured.title", "Featured Services")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {featuredServices.map((service, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{service.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {service.badge}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{service.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };