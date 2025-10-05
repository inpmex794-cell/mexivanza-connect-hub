import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/useAuth";
import { useLanguage } from "@/hooks/use-language";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  TrendingUp,
  Package,
  CalendarIcon,
  Star,
  Users,
  DollarSign,
  MapPin,
  Clock,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye
} from "lucide-react";

import { PagesPage } from "@/dashboard/pages/PagesPage";
import { TagsPage } from "@/dashboard/pages/TagsPage";

const AdminTravelConsole: React.FC = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState("overview");
  const [packages, setPackages] = useState<any[]>([]);
  const [extras, setExtras] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    topDestination: "",
    bookingsThisMonth: 0,
  });

  const [showPackageDialog, setShowPackageDialog] = useState(false);
  const [showExtraDialog, setShowExtraDialog] = useState(false);
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any | null>(null);
  const [editingExtra, setEditingExtra] = useState<any | null>(null);

  const [packageFilter, setPackageFilter] = useState("");
  const [bookingFilter, setBookingFilter] = useState({
    status: "",
    dateRange: "",
    search: "",
  });

  if (authLoading) return <div>Loading authentication…</div>;
  if (!user) return <Navigate to="/user-login" replace />;
  if (!isAdmin) return <div>Access denied</div>;

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchPackages(),
        fetchExtras(), // Keep this for future implementation
        fetchAvailability(), // Keep this for future implementation
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
    // Implement actual fetching for extras here if they exist in Supabase
    // For now, keep mock data if no Supabase table for extras
    setExtras([]);
  };

  const fetchAvailability = async () => {
    // Implement actual fetching for availability here if it exists in Supabase
    // For now, keep mock data if no Supabase table for availability
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
      const destination = booking.travel_packages?.city && booking.travel_packages?.region
        ? `${booking.travel_packages.city}, ${booking.travel_packages.region}`
        : 'Unknown Destination'; // Handle cases where package data might be missing
      acc[destination] = (acc[destination] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topDestination = destinationCounts ?
      Object.entries(destinationCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || '' : '';

    // Bookings this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0); // Normalize to start of month
    const bookingsThisMonth = bookingStats?.filter(booking =>
      booking.travel_start_date && new Date(booking.travel_start_date) >= thisMonth).length || 0;

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
        booking.travel_start_date ? format(new Date(booking.travel_start_date), 'yyyy-MM-dd') : '',
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
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'; // Using more generic success colors
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'; // Using more generic warning colors
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'; // Using more generic destructive colors
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'; // Muted
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

    const matchesStatus = !bookingFilter.status || bookingFilter.status === 'all' ||
      booking.booking_status === bookingFilter.status ||
      booking.payment_status === bookingFilter.status;

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to run once on mount

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
        <TabsList className="grid w-full grid-cols-7">
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
          <TabsTrigger value="pages">
            {language === 'es' ? 'Páginas' : 'Pages'}
          </TabsTrigger>
          <TabsTrigger value="tags">
            {language === 'es' ? 'Etiquetas' : 'Tags'}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* KPI Cards */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === 'es' ? 'Reservas Totales' : 'Total Bookings'}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  {language === 'es' ? 'Número total de reservas' : 'Total number of bookings'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === 'es' ? 'Ingresos Totales' : 'Total Revenue'}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(kpis.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  {language === 'es' ? 'Ingresos de reservas pagadas' : 'Revenue from paid bookings'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === 'es' ? 'Destino Principal' : 'Top Destination'}
                </CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.topDestination || (language === 'es' ? 'N/A' : 'N/A')}</div>
                <p className="text-xs text-muted-foreground">
                  {language === 'es' ? 'Destino con más reservas' : 'Destination with most bookings'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === 'es' ? 'Reservas este Mes' : 'Bookings This Month'}
                </CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.bookingsThisMonth}</div>
                <p className="text-xs text-muted-foreground">
                  {language === 'es' ? 'Nuevas reservas en el mes actual' : 'New bookings in current month'}
                </p>
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
                        {booking.travel_packages?.title?.[language] || 'N/A'} • {format(new Date(booking.travel_start_date), 'MMM dd')}
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
                {bookings.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    {language === 'es' ? 'No hay reservas recientes.' : 'No recent bookings.'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Packages Tab */}
        <TabsContent value="packages" className="space-y-6">
          <div className="flex justify-between items-center">
            <Input
              placeholder={language === 'es' ? 'Buscar paquetes...' : 'Search packages...'}
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="max-w-xs"
            />
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
                  {pkg.gallery?.images?.[0]?.url && ( // Access url safely
                    <img
                      src={pkg.gallery.images[0].url}
                      alt={pkg.title[language]}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  {pkg.featured && (
                    <Badge className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 dark:bg-yellow-600 dark:text-yellow-50">
                      <Star className="w-3 h-3 mr-1" />
                      {language === 'es' ? 'Destacado' : 'Featured'}
                    </Badge>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{pkg.title?.[language] || 'N/A'}</h3>
                    <Badge variant={pkg.is_published ? 'default' : 'secondary'}>
                      {pkg.is_published ? (language === 'es' ? 'Publicado' : 'Published') : (language === 'es' ? 'Borrador' : 'Draft')}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3" />
                      {pkg.city || 'N/A'}, {pkg.region || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {pkg.duration || 'N/A'} {language === 'es' ? 'días' : 'days'}
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
                          // TODO: Implement delete package logic
                          toast.info(language === 'es' ? 'Funcionalidad de eliminar paquete próximamente.' : 'Delete package functionality coming soon.');
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredPackages.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-4">
                {language === 'es' ? 'No se encontraron paquetes.' : 'No packages found.'}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Availability Tab (Placeholder) */}
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

        {/* Extras Tab (Placeholder) */}
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

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center gap-4">
              <Input
                placeholder={language === 'es' ? 'Buscar reservas...' : 'Search bookings...'}
                value={bookingFilter.search}
                onChange={(e) => setBookingFilter(prev => ({ ...prev, search: e.target.value }))}
                className="max-w-xs"
              />
              <Select
                value={bookingFilter.status}
                onValueChange={(value) => setBookingFilter(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={language === 'es' ? 'Estado' : 'Status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'es' ? 'Todos' : 'All'}</SelectItem>
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
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.traveler_name}</div>
                          <div className="text-sm text-muted-foreground">{booking.traveler_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.travel_packages?.title?.[language] || 'N/A'}</div>
                          <div className="text-sm text-muted-foreground">
                            {booking.travel_packages?.city || 'N/A'}, {booking.travel_packages?.region || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {booking.travel_start_date ? format(new Date(booking.travel_start_date), 'MMM dd, yyyy') : 'N/A'}
                      </TableCell>
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
                        <Button variant="outline" size="sm" onClick={() => {
                          // TODO: Implement view booking details logic
                          toast.info(language === 'es' ? 'Funcionalidad de ver reserva próximamente.' : 'View booking functionality coming soon.');
                        }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-4">
                      {language === 'es' ? 'No se encontraron reservas.' : 'No bookings found.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Pages Tab */}
        <TabsContent value="pages">
          <PagesPage />
        </TabsContent>

        {/* Tags Tab */}
        <TabsContent value="tags">
          <TagsPage />
        </TabsContent>
      </Tabs>
      {/* TODO: Add Dialog components for New Package, New Extra, New Availability */}
      {/* Example for a Package Dialog (You'll need to create this component) */}
      {/* {showPackageDialog && (
        <PackageFormDialog
          packageData={editingPackage}
          onClose={() => setShowPackageDialog(false)}
          onSave={fetchPackages} // Re-fetch packages after save
        />
      )} */}
    </div>
  );
};

export default AdminTravelConsole;
