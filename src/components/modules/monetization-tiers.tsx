import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Shield, Star, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';

interface TierFeature {
  name: string;
  included: boolean;
}

interface MonetizationTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: TierFeature[];
  recommended?: boolean;
  icon: React.ReactNode;
  buttonText: string;
  buttonVariant: 'outline' | 'facebook' | 'default';
}

export const MonetizationTiers: React.FC = () => {
  const { user, userRole } = useAuth();
  const { t } = useLanguage();

  const tiers: MonetizationTier[] = [
    {
      id: 'free',
      name: t('tiers.free.name', 'Gratuito'),
      price: 0,
      currency: 'USD',
      period: t('tiers.free.period', 'Siempre'),
      description: t('tiers.free.description', 'Perfecto para empezar'),
      icon: <Star className="h-5 w-5" />,
      buttonText: t('tiers.free.button', 'Plan Actual'),
      buttonVariant: 'outline',
      features: [
        { name: t('features.profile', 'Perfil personal'), included: true },
        { name: t('features.basic_posts', 'Publicaciones básicas'), included: true },
        { name: t('features.view_listings', 'Ver listados'), included: true },
        { name: t('features.basic_messaging', 'Mensajería básica'), included: true },
        { name: t('features.encrypted_chat', 'Chat encriptado'), included: false },
        { name: t('features.ad_posting', 'Publicar anuncios'), included: false },
        { name: t('features.real_estate', 'Listados inmobiliarios'), included: false },
        { name: t('features.priority_support', 'Soporte prioritario'), included: false },
        { name: t('features.ai_tools', 'Herramientas IA'), included: false },
      ]
    },
    {
      id: 'verified',
      name: t('tiers.verified.name', 'Verificado'),
      price: 10,
      currency: 'USD',
      period: t('tiers.verified.period', '/mes'),
      description: t('tiers.verified.description', 'Para profesionales activos'),
      icon: <Shield className="h-5 w-5" />,
      buttonText: t('tiers.verified.button', 'Actualizar a Verificado'),
      buttonVariant: 'facebook',
      recommended: true,
      features: [
        { name: t('features.profile', 'Perfil personal'), included: true },
        { name: t('features.basic_posts', 'Publicaciones básicas'), included: true },
        { name: t('features.view_listings', 'Ver listados'), included: true },
        { name: t('features.basic_messaging', 'Mensajería básica'), included: true },
        { name: t('features.encrypted_chat', 'Chat encriptado'), included: true },
        { name: t('features.ad_posting', 'Publicar anuncios'), included: true },
        { name: t('features.real_estate', 'Listados inmobiliarios'), included: true },
        { name: t('features.whatsapp_verification', 'Verificación WhatsApp'), included: true },
        { name: t('features.priority_support', 'Soporte prioritario'), included: false },
        { name: t('features.ai_tools', 'Herramientas IA'), included: false },
      ]
    },
    {
      id: 'premium',
      name: t('tiers.premium.name', 'Premium'),
      price: 25,
      currency: 'USD',
      period: t('tiers.premium.period', '/mes'),
      description: t('tiers.premium.description', 'Funcionalidad completa + IA'),
      icon: <Crown className="h-5 w-5" />,
      buttonText: t('tiers.premium.button', 'Ir Premium'),
      buttonVariant: 'default',
      features: [
        { name: t('features.profile', 'Perfil personal'), included: true },
        { name: t('features.basic_posts', 'Publicaciones básicas'), included: true },
        { name: t('features.view_listings', 'Ver listados'), included: true },
        { name: t('features.basic_messaging', 'Mensajería básica'), included: true },
        { name: t('features.encrypted_chat', 'Chat encriptado'), included: true },
        { name: t('features.ad_posting', 'Publicar anuncios'), included: true },
        { name: t('features.real_estate', 'Listados inmobiliarios'), included: true },
        { name: t('features.whatsapp_verification', 'Verificación WhatsApp'), included: true },
        { name: t('features.priority_support', 'Soporte prioritario'), included: true },
        { name: t('features.ai_tools', 'Herramientas IA'), included: true },
        { name: t('features.analytics', 'Analytics avanzados'), included: true },
        { name: t('features.ai_site_builder', 'Constructor IA de sitios'), included: true },
      ]
    }
  ];

  const getCurrentTierName = () => {
    if (userRole === 'admin') return 'Admin';
    if (userRole === 'verified') return 'Verificado';
    return 'Gratuito';
  };

  const handleUpgrade = (tierId: string) => {
    // In real implementation, this would integrate with Stripe
    console.log('Upgrading to:', tierId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {t('tiers.title', 'Elige tu plan')}
        </h2>
        <p className="text-muted-foreground">
          {t('tiers.subtitle', 'Desbloquea funciones premium para hacer crecer tu negocio')}
        </p>
        {user && (
          <Badge variant="secondary" className="mt-4">
            {t('tiers.current_plan', 'Plan actual')}: {getCurrentTierName()}
          </Badge>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className={cn(
              "relative",
              tier.recommended && "border-primary shadow-lg"
            )}
          >
            {tier.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Zap className="h-3 w-3 mr-1" />
                  {t('tiers.recommended', 'Recomendado')}
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-2">
                {tier.icon}
              </div>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  {tier.price === 0 ? t('tiers.free_price', 'Gratis') : `$${tier.price}`}
                </span>
                {tier.price > 0 && (
                  <span className="text-muted-foreground">
                    {tier.period}
                  </span>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check
                      className={cn(
                        "h-4 w-4",
                        feature.included
                          ? "text-success"
                          : "text-muted-foreground opacity-50"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm",
                        !feature.included && "text-muted-foreground line-through"
                      )}
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button
                variant={tier.buttonVariant}
                className="w-full"
                onClick={() => handleUpgrade(tier.id)}
                disabled={
                  (tier.id === 'free' && (!userRole || userRole === 'user')) ||
                  (tier.id === 'verified' && userRole === 'verified') ||
                  userRole === 'admin'
                }
              >
                {userRole === 'admin' 
                  ? t('tiers.admin_access', 'Acceso Admin') 
                  : tier.buttonText
                }
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <h3 className="font-semibold mb-2">
          {t('tiers.enterprise.title', '¿Necesitas algo más?')}
        </h3>
        <p className="text-muted-foreground mb-4">
          {t('tiers.enterprise.description', 'Contacta nuestro equipo para soluciones empresariales personalizadas')}
        </p>
        <Button variant="outline">
          {t('button.contact_sales', 'Contactar Ventas')}
        </Button>
      </div>
    </div>
  );
};