import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  User, 
  Settings, 
  Plane, 
  Scale, 
  Building, 
  Users, 
  Monitor, 
  Briefcase,
  Video,
  MessageSquare,
  Gamepad2,
  BarChart3,
  FileText,
  MapPin
} from 'lucide-react';

export const LeftSidebar: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: '/home', icon: Home, label: t('nav.home', 'Inicio'), active: true },
    { path: '/dashboard', icon: User, label: t('nav.dashboard', 'Dashboard'), requiresAuth: true },
    { path: '/settings', icon: Settings, label: t('nav.settings', 'Configuración'), requiresAuth: true }
  ];

  const serviceItems = [
    { 
      path: '/travel', 
      icon: Plane, 
      label: t('services.travel', 'Viajes'),
      description: t('services.travel_desc', 'Paquetes premium'),
      color: 'text-primary'
    },
    { 
      path: '/legal', 
      icon: Scale, 
      label: t('services.legal', 'Legal'),
      description: t('services.legal_desc', 'Consulta gratuita'),
      color: 'text-success'
    },
    { 
      path: '/real-estate', 
      icon: Building, 
      label: t('real_estate.title', 'Bienes Raíces'),
      description: '+500 propiedades',
      color: 'text-primary'
    },
    { 
      path: '/business-directory', 
      icon: Users, 
      label: t('directory.title', 'Directorio'),
      description: t('directory.verified_businesses', 'Negocios verificados'),
      color: 'text-success'
    },
    { 
      path: '/web-development', 
      icon: Monitor, 
      label: t('web_dev.title', 'Desarrollo Web'),
      description: t('services.webdev_desc', 'Soluciones digitales'),
      color: 'text-primary'
    }
  ];

  const mediaItems = [
    { 
      path: '/videos', 
      icon: Video, 
      label: t('media.videos', 'Videos'),
      description: 'TikTok-style feed',
      color: 'text-destructive'
    },
    { 
      path: '/messenger', 
      icon: MessageSquare, 
      label: t('messenger.title', 'Messenger'),
      description: 'Chat encriptado',
      color: 'text-primary'
    },
    { 
      path: '/gaming', 
      icon: Gamepad2, 
      label: t('gaming.title', 'Gaming'),
      description: 'Hub de juegos',
      color: 'text-success'
    },
    { 
      path: '/finance', 
      icon: BarChart3, 
      label: t('finance.title', 'Bolsa de Valores'),
      description: 'Mercados mexicanos',
      color: 'text-primary'
    }
  ];

  return (
    <aside className="w-64 bg-card border-r border-border fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto shadow-sm">
      <div className="p-4">
        {/* Main Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            if (item.requiresAuth && !user) return null;
            
            return (
              <Button
                key={item.path}
                asChild
                variant={isActive(item.path) ? "default" : "ghost"}
                className="w-full justify-start rounded-lg"
              >
                <Link to={item.path}>
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>

        {/* Premium Services */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-3">
            {t('services.premium', 'Servicios Premium')}
          </h3>
          <div className="space-y-1">
            {serviceItems.map((service) => (
              <Button
                key={service.path}
                asChild
                variant="ghost"
                className="w-full justify-start text-sm hover:bg-accent rounded-lg p-3 h-auto"
              >
                <Link to={service.path}>
                  <service.icon className={`mr-3 h-4 w-4 ${service.color}`} />
                  <div className="text-left">
                    <div className="font-medium">{service.label}</div>
                    <div className="text-xs text-muted-foreground">{service.description}</div>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Media & Tools */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-3">
            {t('media.title', 'Media & Herramientas')}
          </h3>
          <div className="space-y-1">
            {mediaItems.map((media) => (
              <Button
                key={media.path}
                asChild
                variant="ghost"
                className="w-full justify-start text-sm hover:bg-accent rounded-lg p-3 h-auto"
              >
                <Link to={media.path}>
                  <media.icon className={`mr-3 h-4 w-4 ${media.color}`} />
                  <div className="text-left">
                    <div className="font-medium">{media.label}</div>
                    <div className="text-xs text-muted-foreground">{media.description}</div>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        {user && (
          <div className="mt-6 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-3">
              {t('actions.quick', 'Acciones Rápidas')}
            </h3>
            <div className="space-y-1">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                {t('actions.create_post', 'Crear Post')}
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Briefcase className="mr-2 h-4 w-4" />
                {t('actions.add_business', 'Agregar Negocio')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};