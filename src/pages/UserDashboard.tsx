import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, MapPin, User, Mail, Phone, Edit, Eye } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface UserBooking {
  id: string;
  traveler_name: string;
  traveler_email: string;
  travel_start_date: string;
  travel_end_date: string;
  number_of_travelers: number;
  total_amount: number;
  status: string;
  created_at: string;
  travel_packages?: {
    title: any;
    destination: string;
    duration: number;
    currency: string;
  };
}

interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
  created_at: string;
}

export function UserDashboard() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const [bookingsRes, profileRes] = await Promise.all([
        supabase
          .from('travel_bookings')
          .select(`
            *,
            travel_packages (
              title,
              destination,
              duration,
              currency
            )
          `)
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .single()
      ]);

      if (bookingsRes.error) throw bookingsRes.error;
      if (profileRes.error) console.warn('Profile not found:', profileRes.error);

      setBookings(bookingsRes.data || []);
      setProfile(profileRes.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPackageTitle = (title: any) => {
    if (typeof title === 'object' && title !== null) {
      return title[language] || title['es'] || 'Package';
    }
    return title || 'Package';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return t('confirmed', 'Confirmada');
      case 'pending':
        return t('pending', 'Pendiente');
      case 'cancelled':
        return t('cancelled', 'Cancelada');
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Account Header */}
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex-shrink-0"></div>
              <span className="text-lg font-bold text-foreground">Mexivanza</span>
            </Link>
            <span className="text-muted-foreground">Mi Cuenta</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Link to="/travel/packages">
              <Button variant="outline" size="sm">
                {t('browsePackages', 'Explorar Paquetes')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.name} />
              ) : (
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                {t('welcome', 'Bienvenido')}, {profile?.name || user?.email}
              </h1>
              <p className="text-muted-foreground">
                {t('dashboardSubtitle', 'Gestiona tus reservas y perfil')}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('totalBookings', 'Reservas Totales')}</p>
                    <p className="text-2xl font-bold text-primary">{bookings.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('confirmedBookings', 'Confirmadas')}</p>
                    <p className="text-2xl font-bold text-green-600">
                      {bookings.filter(b => b.status === 'confirmed').length}
                    </p>
                  </div>
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('pendingBookings', 'Pendientes')}</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {bookings.filter(b => b.status === 'pending').length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bookings">{t('myBookings', 'Mis Reservas')}</TabsTrigger>
            <TabsTrigger value="profile">{t('profile', 'Perfil')}</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{t('recentBookings', 'Reservas Recientes')}</h2>
                <Link to="/travel/packages">
                  <Button>{t('browsePackages', 'Explorar Paquetes')}</Button>
                </Link>
              </div>

              {bookings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {t('noBookingsYet', 'Aún no tienes reservas')}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {t('startExploring', 'Comienza explorando nuestros increíbles paquetes de viaje')}
                    </p>
                    <Link to="/travel/packages">
                      <Button className="bg-primary hover:bg-primary/90">
                        {t('explorePackages', 'Explorar Paquetes')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">
                                {getPackageTitle(booking.travel_packages?.title)}
                              </h3>
                              <Badge variant={getStatusBadgeVariant(booking.status)}>
                                {getStatusText(booking.status)}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{booking.travel_packages?.destination}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {format(new Date(booking.travel_start_date), 'dd/MM/yyyy')} - {' '}
                                  {format(new Date(booking.travel_end_date), 'dd/MM/yyyy')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{booking.number_of_travelers} {t('travelers', 'viajeros')}</span>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <span className="text-xl font-bold text-primary">
                                ${booking.total_amount?.toLocaleString()} {booking.travel_packages?.currency}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Link to={`/travel/booking-confirmation/${booking.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                {t('viewDetails', 'Ver Detalles')}
                              </Button>
                            </Link>
                            {booking.status === 'pending' && (
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                {t('modify', 'Modificar')}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('profileInformation', 'Información del Perfil')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('name', 'Nombre')}
                    </label>
                    <p className="text-lg">{profile?.name || 'No especificado'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('email', 'Email')}
                    </label>
                    <p className="text-lg">{user?.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('memberSince', 'Miembro desde')}
                    </label>
                    <p className="text-lg">
                      {profile?.created_at && format(new Date(profile.created_at), 'MMMM yyyy', { locale: es })}
                    </p>
                  </div>
                </div>
                
                <div className="pt-6">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Edit className="h-4 w-4 mr-2" />
                    {t('editProfile', 'Editar Perfil')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}