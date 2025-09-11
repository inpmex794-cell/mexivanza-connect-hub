import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Home,
  Plane,
  Scale,
  Monitor,
  MapPin,
  Users,
  Settings,
  User,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const navigationItems = [
    { key: "nav.home", href: "/", icon: Home },
    { key: "nav.travel", href: "/travel", icon: Plane },
    { key: "nav.legal", href: "/legal", icon: Scale },
    { key: "nav.digital", href: "/digital", icon: Monitor },
  ];

  const regionItems = [
    { key: "region.north", href: "/regions/north", icon: MapPin },
    { key: "region.pacific", href: "/regions/pacific", icon: MapPin },
    { key: "region.central", href: "/regions/central", icon: MapPin },
    { key: "region.southeast", href: "/regions/southeast", icon: MapPin },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Main Navigation */}
        <div>
          <h3 className="text-xs font-semibold text-sidebar-foreground uppercase tracking-wider mb-3">
            {t("nav.services", "Services")}
          </h3>
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all",
                  isActive(item.href)
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {t(item.key)}
              </Link>
            ))}
          </nav>
        </div>

        {/* Regions */}
        <div>
          <h3 className="text-xs font-semibold text-sidebar-foreground uppercase tracking-wider mb-3">
            {t("nav.regions", "Regions")}
          </h3>
          <nav className="space-y-1">
            {regionItems.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all",
                  location.pathname.startsWith(item.href)
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {t(item.key)}
              </Link>
            ))}
          </nav>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xs font-semibold text-sidebar-foreground uppercase tracking-wider mb-3">
            {t("nav.actions", "Quick Actions")}
          </h3>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              asChild
            >
              <Link to="/dashboard">
                <User className="mr-3 h-5 w-5" />
                {t("nav.dashboard", "Dashboard")}
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              asChild
            >
              <Link to="/profile">
                <Users className="mr-3 h-5 w-5" />
                {t("nav.profile", "Profile")}
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              asChild
            >
              <Link to="/settings">
                <Settings className="mr-3 h-5 w-5" />
                {t("nav.settings", "Settings")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};