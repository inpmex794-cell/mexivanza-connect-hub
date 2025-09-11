import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Settings, Crown, CheckCircle } from 'lucide-react';

interface RoleDisplayProps {
  className?: string;
}

export const RoleBasedDisplay: React.FC<RoleDisplayProps> = ({ className = "" }) => {
  const { user, userRole, isAdmin } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  const getRoleInfo = () => {
    if (isAdmin) {
      return {
        icon: Crown,
        title: t("role.admin_title", "Administrator"),
        description: t("role.admin_desc", "Full platform access and management"),
        color: "text-red-600",
        bgColor: "bg-red-100 dark:bg-red-900",
        borderColor: "border-red-200 dark:border-red-800",
        access: [
          "Global content editing",
          "User management", 
          "Service publishing",
          "Platform analytics",
          "Verification workflows"
        ]
      };
    } else if (userRole === 'verified') {
      return {
        icon: CheckCircle,
        title: t("role.verified_title", "Verified User"),
        description: t("role.verified_desc", "Enhanced features and verified status"),
        color: "text-green-600",
        bgColor: "bg-green-100 dark:bg-green-900", 
        borderColor: "border-green-200 dark:border-green-800",
        access: [
          "Encrypted messaging",
          "Ad posting",
          "Real estate listings",
          "Priority support",
          "Verified badge"
        ]
      };
    } else {
      return {
        icon: Users,
        title: t("role.user_title", "Standard User"),
        description: t("role.user_desc", "Access to public features"),
        color: "text-blue-600",
        bgColor: "bg-blue-100 dark:bg-blue-900",
        borderColor: "border-blue-200 dark:border-blue-800",
        access: [
          "Public content viewing",
          "Basic messaging",
          "Profile management",
          "Travel packages",
          "Legal services"
        ]
      };
    }
  };

  const roleInfo = getRoleInfo();
  const IconComponent = roleInfo.icon;

  return (
    <Card className={`${roleInfo.bgColor} ${roleInfo.borderColor} ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <IconComponent className={`h-6 w-6 ${roleInfo.color}`} />
          <div>
            <div className={`font-semibold ${roleInfo.color}`}>
              {roleInfo.title}
            </div>
            <div className="text-sm text-muted-foreground font-normal">
              {roleInfo.description}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground mb-3">
            {t("role.access_level", "Access Level:")}
          </p>
          <ul className="space-y-1">
            {roleInfo.access.map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className={`h-1.5 w-1.5 rounded-full ${roleInfo.color.replace('text-', 'bg-')}`} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

interface QuickActionsProps {
  className?: string;
}

export const RoleBasedQuickActions: React.FC<QuickActionsProps> = ({ className = "" }) => {
  const { user, userRole, isAdmin } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  const getQuickActions = () => {
    if (isAdmin) {
      return [
        { title: "Admin Dashboard", path: "/admin-dashboard", icon: Crown },
        { title: "User Management", path: "/admin/users", icon: Users },
        { title: "Platform Settings", path: "/admin/settings", icon: Settings }
      ];
    } else if (userRole === 'verified') {
      return [
        { title: "Verified Dashboard", path: "/verified-dashboard", icon: Shield },
        { title: "Post Advertisement", path: "/create-ad", icon: Settings },
        { title: "Encrypted Messages", path: "/messages", icon: Users }
      ];
    } else {
      return [
        { title: "User Dashboard", path: "/dashboard", icon: Users },
        { title: "Browse Services", path: "/services", icon: Settings },
        { title: "Contact Support", path: "/contact", icon: Shield }
      ];
    }
  };

  const actions = getQuickActions();

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="font-semibold text-foreground">
        {t("role.quick_actions", "Quick Actions")}
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Button
              key={index}
              variant="outline"
              className="justify-start h-auto p-3"
              onClick={() => window.location.href = action.path}
            >
              <IconComponent className="h-4 w-4 mr-3" />
              <span className="text-sm">{action.title}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};