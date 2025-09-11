import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plane, 
  Scale, 
  Monitor, 
  MapPin, 
  Users, 
  Clock,
  Globe,
  Shield,
  Award,
  Heart,
  MessageSquare,
  UserPlus,
  LogIn
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-mexico.jpg";

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();

  const services = [
    {
      icon: Plane,
      title: "Paquetes de Viaje",
      description: "Experiencias de viaje curadas por expertos a través de México",
      features: ["Itinerarios personalizados", "Experiencias locales", "Soporte 24/7"],
      href: "/travel"
    },
    {
      icon: Scale,
      title: "Servicios Legales",
      description: "Asistencia legal profesional y servicios de consultoría",
      features: ["Revisión de contratos", "Formación de empresas", "Apoyo migratorio"],
      href: "/legal"
    },
    {
      icon: Monitor,
      title: "Desarrollo Web",
      description: "Soluciones tecnológicas modernas para empresas e individuos",
      features: ["Desarrollo web", "Marketing digital", "Consultoría tech"],
      href: "/webdev"
    },
    {
      icon: MapPin,
      title: "Bienes Raíces",
      description: "Propiedades verificadas en las mejores ubicaciones de México",
      features: ["Listados verificados", "Asesoría especializada", "Financiamiento"],
      href: "/realestate"
    }
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: "Usuarios Activos" },
    { icon: MapPin, value: "32", label: "Estados Cubiertos" },
    { icon: Clock, value: "24/7", label: "Soporte Disponible" },
    { icon: Award, value: "5+", label: "Años de Experiencia" }
  ];

  const featuredPosts = [
    {
      id: 1,
      title: "Nuevos Paquetes de Viaje Disponibles",
      content: "Descubre increíbles nuevos destinos en México con nuestras experiencias de viaje curadas.",
      image: heroImage,
      time: "Hace 2h",
      likes: 24,
      comments: 8,
      category: "Viajes"
    },
    {
      id: 2,
      title: "Tip Legal: Registro de Empresas",
      content: "Pasos esenciales para registrar tu empresa en México. Nuestros expertos legales te guían.",
      time: "Hace 4h",
      likes: 18,
      comments: 5,
      category: "Legal"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Mexivanza</h1>
                <p className="text-xs text-muted-foreground">Plataforma Integral de Servicios</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <Badge variant={isAdmin ? "default" : "secondary"}>
                    {isAdmin ? "Admin" : "Usuario"}
                  </Badge>
                  {isAdmin && (
                    <Button asChild size="sm">
                      <Link to="/admin-dashboard">
                        <Shield className="mr-2 h-4 w-4" />
                        Dashboard Admin
                      </Link>
                    </Button>
                  )}
                  <Button asChild variant="outline" size="sm">
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/auth">
                      <LogIn className="mr-2 h-4 w-4" />
                      Iniciar Sesión
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link to="/auth">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Registrarse
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="relative">
            <img
              src={heroImage}
              alt="Mexivanza - Servicios integrales para México"
              className="w-full h-96 object-cover rounded-xl shadow-elegant"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <Badge variant="secondary" className="mb-4">
                <Globe className="mr-1 h-3 w-3" />
                Plataforma Soberana
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Mexivanza AI Master Platform
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Servicios integrales de viaje, legal, desarrollo web y bienes raíces 
                con control administrativo soberano y características sociales públicas
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Services Grid */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Módulos de Servicios Soberanos</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Servicios controlados por administradores con acceso cifrado y gestión basada en roles
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-medium transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{service.title}</h3>
                      <p className="text-muted-foreground mb-3">{service.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {service.features.map((feature, featureIndex) => (
                          <Badge key={featureIndex} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" asChild>
                        <Link to={service.href}>Explorar Servicio</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Content */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Contenido Destacado</h2>
            <p className="text-muted-foreground">
              Últimas actualizaciones y contenido curado por nuestros administradores
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-medium transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">M</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold">Mexivanza</span>
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{post.time}</span>
                      </div>
                      <h3 className="font-semibold mb-2">{post.title}</h3>
                      <p className="text-muted-foreground mb-4">{post.content}</p>
                      
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <Heart className="mr-2 h-4 w-4" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            {post.comments}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Únete a la Plataforma Mexivanza</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Accede a servicios integrales, conecta con profesionales verificados y 
            forma parte de la comunidad empresarial más importante de México
          </p>
          <div className="flex items-center justify-center space-x-4">
            {!user && (
              <>
                <Button size="lg" asChild>
                  <Link to="/auth">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Crear Cuenta Gratuita
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/auth">Iniciar Sesión</Link>
                </Button>
              </>
            )}
            {user && !isAdmin && (
              <Button size="lg" asChild>
                <Link to="/dashboard">
                  <Shield className="mr-2 h-5 w-5" />
                  Ver Mi Dashboard
                </Link>
              </Button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};