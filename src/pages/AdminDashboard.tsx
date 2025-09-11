import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  Settings, 
  BarChart3, 
  MessageSquare,
  FileText,
  Globe,
  Zap,
  Crown,
  Edit3,
  Eye,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  UserCheck,
  MapPin
} from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { MonetizationTiers } from '@/components/modules/monetization-tiers';
import { EncryptedMessenger } from '@/components/modules/encrypted-messenger';
import { AdminCategoriesManager } from '@/components/travel/admin-categories-manager';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>;
  }

  // Enforce admin sovereignty - only mexivanza@mexivanza.com or admin role
  if (!user || (!isAdmin && user.email !== 'mexivanza@mexivanza.com')) {
    return <Navigate to="/" replace />;
  }

  const dashboardStats = [
    {
      title: "Total usuarios",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Ingresos mes",
      value: "$12,450",
      change: "+18%",
      trend: "up",
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      title: "Verificados",
      value: "89",
      change: "+5%",
      trend: "up",
      icon: <UserCheck className="h-5 w-5" />
    },
    {
      title: "Posts activos",
      value: "456",
      change: "+23%",
      trend: "up",
      icon: <FileText className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Crown className="h-8 w-8" />
                Panel Soberano Mexivanza
              </h1>
              <p className="opacity-90 mt-2">
                Control total de la plataforma
              </p>
            </div>
            <Badge variant="destructive" className="bg-red-500 text-white">
              <Zap className="h-3 w-3 mr-1" />
              Acceso Soberano
            </Badge>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Vista General
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="content">
              <Globe className="h-4 w-4 mr-2" />
              Contenido
            </TabsTrigger>
            <TabsTrigger value="travel">
              <MapPin className="h-4 w-4 mr-2" />
              Viajes
            </TabsTrigger>
            <TabsTrigger value="messaging">
              <MessageSquare className="h-4 w-4 mr-2" />
              Mensajería
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm flex items-center gap-1 text-success">
                          <TrendingUp className="h-3 w-3" />
                          {stat.change}
                        </p>
                      </div>
                      <div className="text-primary">
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <MonetizationTiers />
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Editor de Contenido Global
                </CardTitle>
                <CardDescription>
                  Gestionar todo el contenido de la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Globe className="h-6 w-6 mb-2" />
                    Contenido Principal
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    Páginas de Servicio
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <MessageSquare className="h-6 w-6 mb-2" />
                    Templates de Notificación
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Travel Tab */}
          <TabsContent value="travel" className="space-y-6">
            <AdminCategoriesManager />
          </TabsContent>

          {/* Messaging Tab */}
          <TabsContent value="messaging" className="space-y-6">
            <EncryptedMessenger />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuración del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-16 flex flex-col">
                      <Shield className="h-5 w-5 mb-1" />
                      Configuración de Seguridad
                    </Button>
                    <Button variant="outline" className="h-16 flex flex-col">
                      <DollarSign className="h-5 w-5 mb-1" />
                      Configuración de Pagos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};