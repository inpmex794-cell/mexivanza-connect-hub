import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Settings, BarChart3, FileText } from "lucide-react";
import { toast } from "sonner";

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    // This will be replaced with actual Supabase logout
    console.log("Logout attempt");
    toast.success("Sesión cerrada exitosamente");
    navigate("/");
  };

  const dashboardCards = [
    {
      title: "Mis Reservaciones",
      description: "Viajes y servicios reservados",
      icon: FileText,
      count: "3",
      link: "/dashboard/bookings",
    },
    {
      title: "Consultas Legales",
      description: "Casos y documentos legales",
      icon: BarChart3,
      count: "2",
      link: "/dashboard/legal",
    },
    {
      title: "Proyectos Digitales", 
      description: "Servicios digitales activos",
      icon: Settings,
      count: "1",
      link: "/dashboard/digital",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t("dashboard.welcome")}
            </h1>
            <p className="text-muted-foreground mt-2">
              Gestiona tus servicios y reservaciones
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Perfil
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t("dashboard.logout")}
            </Button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="hover:shadow-medium transition-all duration-300 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.count}</div>
                  <p className="text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas acciones en tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Reservación confirmada</p>
                  <p className="text-sm text-muted-foreground">
                    Viaje a Cancún - 15 de diciembre
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">Hace 2 horas</span>
              </div>
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Consulta legal programada</p>
                  <p className="text-sm text-muted-foreground">
                    Constitución de empresa - 20 de diciembre
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">Hace 1 día</span>
              </div>
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">Proyecto digital iniciado</p>
                  <p className="text-sm text-muted-foreground">
                    Desarrollo de sitio web corporativo
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">Hace 3 días</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supabase Integration Notice */}
        <Card className="mt-8 bg-muted/50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">🔐 Dashboard Completo con Supabase</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Para acceder a todas las funciones del dashboard, incluyendo autenticación real, 
                datos de usuario y gestión de reservaciones, conecta tu proyecto a Supabase.
              </p>
              <Button variant="facebook">
                Conectar Supabase
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};