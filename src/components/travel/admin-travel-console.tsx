import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plane, Package, Calendar as CalendarIcon, Star, Plus, Edit, Trash2, 
  Filter, Download, Search, MapPin, Clock, Users, DollarSign,
  TrendingUp, Eye, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Navigate } from 'react-router-dom';

interface TravelPackage {
  id: string;
  title: any;
  description: any;
  region: string;
  city: string;
  duration: number;
  pricing_tiers: any;
  gallery: any;
  scenario_tags: string[];
  featured: boolean;
  is_published: boolean;
  availability: number;
}

interface TravelExtra {
  id: string;
  name: any;
  description: any;
  price: number;
  per_person: boolean;
  category: string;
  package_id?: string;
}

interface AvailabilitySlot {
  id: string;
  package_id: string;
  available_date: string;
  capacity: number;
  booked_count: number;
  price_multiplier: number;
}

interface Booking {
  id: string;
  user_id: string;
  package_id: string;
  travel_start_date: string;
  travel_end_date: string;
  number_of_travelers: number;
  total_amount: number;
  traveler_name: string;
  traveler_email: string;
  booking_status: string;
  payment_status: string;
  created_at: string;
  travel_packages: {
    title: any;
    city: string;
    region: string;
  };
}

export const AdminTravelConsole: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { language } = useLanguage();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [extras, setExtras] = useState<TravelExtra[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [showPackageDialog, setShowPackageDialog] = useState(false);
  const [showExtraDialog, setShowExtraDialog] = useState(false);
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false);
  
  // Editing states
  const [editingPackage, setEditingPackage] = useState<TravelPackage | null>(null);
  const [editingExtra, setEditingExtra] = useState<TravelExtra | null>(null);
  
  // Filters
  const [packageFilter, setPackageFilter] = useState('');
  const [bookingFilter, setBookingFilter] = useState({
    status: '',
    dateRange: '',
    search: ''
  });

  // KPIs
  const [kpis, setKpis] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    topDestination: '',
    bookingsThisMonth: 0
  });

  // Admin check
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchPackages(),
        fetchExtras(),
        fetchAvailability(),
        fetchBookings(),
        calculateKPIs()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(language === 'es' ? 'Error al cargar datos' : 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    const { data, error } = await supabase
      .from('travel_packages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    setPackages(data || []);
  };

  const fetchExtras = async () => {
    // Mock data for now
    setExtras([]);
  };

  const fetchAvailability = async () => {
    // Mock data for now  
    setAvailability([]);
  };

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('travel_bookings')
      .select(`
        *,
        travel_packages (title, city, region)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    setBookings(data || []);
  };

  const calculateKPIs = async () => {
    const { data: bookingStats, error } = await supabase
      .from('travel_bookings')
      .select('total_amount, travel_start_date, payment_status, travel_packages (city, region)');

    if (error) throw error;

    const totalBookings = bookingStats?.length || 0;
    const totalRevenue = bookingStats?.reduce((sum, booking) => 
      booking.payment_status === 'paid' ? sum + (booking.total_amount || 0) : sum, 0) || 0;
    
    // Find top destination
    const destinationCounts = bookingStats?.reduce((acc, booking) => {
      const destination = `${booking.travel_packages?.city}, ${booking.travel_packages?.region}`;
      acc[destination] = (acc[destination] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topDestination = destinationCounts ? 
      Object.entries(destinationCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || '' : '';

    // Bookings this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const bookingsThisMonth = bookingStats?.filter(booking => 
      new Date(booking.travel_start_date) >= thisMonth).length || 0;

    setKpis({
      totalBookings,
      totalRevenue,
      topDestination,
      bookingsThisMonth
    });
  };

  const exportBookingsCSV = () => {
    const csvContent = [
      ['ID', 'Traveler', 'Email', 'Package', 'Date', 'Travelers', 'Amount', 'Status', 'Payment'].join(','),
      ...bookings.map(booking => [
        booking.id,
        booking.traveler_name,
        booking.traveler_email,
        booking.travel_packages?.title?.[language] || '',
        booking.travel_start_date,
        booking.number_of_travelers,
        booking.total_amount,
        booking.booking_status,
        booking.payment_status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mexivanza-bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'confirmed':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.title?.[language]?.toLowerCase().includes(packageFilter.toLowerCase()) ||
    pkg.city?.toLowerCase().includes(packageFilter.toLowerCase()) ||
    pkg.region?.toLowerCase().includes(packageFilter.toLowerCase())
  );

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !bookingFilter.search || 
      booking.traveler_name.toLowerCase().includes(bookingFilter.search.toLowerCase()) ||
      booking.traveler_email.toLowerCase().includes(bookingFilter.search.toLowerCase());
    
    const matchesStatus = !bookingFilter.status || 
      booking.booking_status === bookingFilter.status ||
      booking.payment_status === bookingFilter.status;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="container-safe py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-16 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-safe py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          {language === 'es' ? 'Consola de Viajes' : 'Travel Console'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'es' ? 'Gestión completa del sistema de viajes' : 'Complete travel system management'}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <TrendingUp className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Resumen' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="packages">
            <Package className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Paquetes' : 'Packages'}
          </TabsTrigger>
          <TabsTrigger value="availability">
            <CalendarIcon className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Disponibilidad' : 'Availability'}
          </TabsTrigger>
          <TabsTrigger value="extras">
            <Star className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Extras' : 'Extras'}
          </TabsTrigger>
          <TabsTrigger value="bookings">
            <Users className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Reservas' : 'Bookings'}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{kpis.totalBookings}</div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Reservas totales' : 'Total bookings'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-success/10 rounded-lg">
                    <DollarSign className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formatPrice(kpis.totalRevenue)}</div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Ingresos totales' : 'Total revenue'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{kpis.topDestination}</div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Destino popular' : 'Top destination'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-warning/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{kpis.bookingsThisMonth}</div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'es' ? 'Este mes' : 'This month'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'es' ? 'Reservas recientes' : 'Recent bookings'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{booking.traveler_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.travel_packages?.title?.[language]} • {format(new Date(booking.travel_start_date), 'MMM dd')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatPrice(booking.total_amount)}</div>
                      <Badge className={getStatusColor(booking.payment_status)}>
                        {booking.payment_status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Packages Tab */}
        <TabsContent value="packages" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Input
                placeholder={language === 'es' ? 'Buscar paquetes...' : 'Search packages...'}
                value={packageFilter}
                onChange={(e) => setPackageFilter(e.target.value)}
                className="w-64"
              />
            </div>
            <Button onClick={() => {
              setEditingPackage(null);
              setShowPackageDialog(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Nuevo paquete' : 'New package'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <Card key={pkg.id}>
                <div className="relative">
                  {pkg.gallery?.images?.[0] && (
                    <img
                      src={pkg.gallery.images[0].url}
                      alt={pkg.title[language]}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  {pkg.featured && (
                    <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      {language === 'es' ? 'Destacado' : 'Featured'}
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{pkg.title[language]}</h3>
                    <Badge variant={pkg.is_published ? 'default' : 'secondary'}>
                      {pkg.is_published ? (language === 'es' ? 'Publicado' : 'Published') : (language === 'es' ? 'Borrador' : 'Draft')}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3" />
                      {pkg.city}, {pkg.region}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {pkg.duration} {language === 'es' ? 'días' : 'days'}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary">
                      {formatPrice(pkg.pricing_tiers?.standard?.price || 0)}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingPackage(pkg);
                          setShowPackageDialog(true);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Delete package logic
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Input
                placeholder={language === 'es' ? 'Buscar reservas...' : 'Search bookings...'}
                value={bookingFilter.search}
                onChange={(e) => setBookingFilter(prev => ({ ...prev, search: e.target.value }))}
                className="w-64"
              />
              <Select 
                value={bookingFilter.status} 
                onValueChange={(value) => setBookingFilter(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={language === 'es' ? 'Estado' : 'Status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{language === 'es' ? 'Todos' : 'All'}</SelectItem>
                  <SelectItem value="pending">{language === 'es' ? 'Pendiente' : 'Pending'}</SelectItem>
                  <SelectItem value="confirmed">{language === 'es' ? 'Confirmado' : 'Confirmed'}</SelectItem>
                  <SelectItem value="paid">{language === 'es' ? 'Pagado' : 'Paid'}</SelectItem>
                  <SelectItem value="cancelled">{language === 'es' ? 'Cancelado' : 'Cancelled'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={exportBookingsCSV}>
              <Download className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Exportar CSV' : 'Export CSV'}
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'es' ? 'Viajero' : 'Traveler'}</TableHead>
                  <TableHead>{language === 'es' ? 'Paquete' : 'Package'}</TableHead>
                  <TableHead>{language === 'es' ? 'Fecha' : 'Date'}</TableHead>
                  <TableHead>{language === 'es' ? 'Personas' : 'Travelers'}</TableHead>
                  <TableHead>{language === 'es' ? 'Total' : 'Total'}</TableHead>
                  <TableHead>{language === 'es' ? 'Estado' : 'Status'}</TableHead>
                  <TableHead>{language === 'es' ? 'Pago' : 'Payment'}</TableHead>
                  <TableHead>{language === 'es' ? 'Acciones' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.traveler_name}</div>
                        <div className="text-sm text-muted-foreground">{booking.traveler_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.travel_packages?.title?.[language]}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.travel_packages?.city}, {booking.travel_packages?.region}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(booking.travel_start_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{booking.number_of_travelers}</TableCell>
                    <TableCell className="font-medium">{formatPrice(booking.total_amount)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.booking_status)}>
                        {booking.booking_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.payment_status)}>
                        {booking.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Availability and Extras tabs would go here... */}
        <TabsContent value="availability" className="space-y-6">
          <div className="text-center py-12">
            <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {language === 'es' ? 'Gestión de disponibilidad' : 'Availability management'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'es' ? 'Próximamente' : 'Coming soon'}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="extras" className="space-y-6">
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {language === 'es' ? 'Gestión de extras' : 'Extras management'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'es' ? 'Próximamente' : 'Coming soon'}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};