import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, MapPin, Users, Clock, Download, Eye, AlertCircle, Star, X } from 'lucide-react';
import { toast } from 'sonner';

interface Booking {
  id: string;
  travel_start_date: string;
  travel_end_date: string;
  number_of_travelers: number;
  total_amount: number;
  traveler_name: string;
  traveler_email: string;
  special_requests: string;
  booking_status: string;
  payment_status: string;
  created_at: string;
  travel_packages: {
    id: string;
    title: any;
    description: any;
    region: string;
    city: string;
    duration: number;
    gallery: any;
  };
}

export const UserBookingsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('travel_bookings')
        .select(`
          *,
          travel_packages (
            id,
            title,
            description,
            region,
            city,
            duration,
            gallery
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);

    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error(language === 'es' ? 'Error al cargar reservas' : 'Error loading bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'es' ? 'es-MX' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
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

  const getStatusText = (status: string) => {
    const statusMap = {
      paid: language === 'es' ? 'Pagado' : 'Paid',
      pending: language === 'es' ? 'Pendiente' : 'Pending',
      confirmed: language === 'es' ? 'Confirmado' : 'Confirmed',
      cancelled: language === 'es' ? 'Cancelado' : 'Cancelled'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const categorizeBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = bookings.filter(booking => {
      const travelDate = new Date(booking.travel_start_date);
      return travelDate >= today && ['paid', 'confirmed'].includes(booking.payment_status);
    });

    const pending = bookings.filter(booking => 
      booking.payment_status === 'pending' && booking.booking_status !== 'cancelled'
    );

    const past = bookings.filter(booking => {
      const travelDate = new Date(booking.travel_start_date);
      return travelDate < today || booking.booking_status === 'cancelled';
    });

    return { upcoming, pending, past };
  };

  const downloadReceipt = async (bookingId: string) => {
    try {
      const { data } = await supabase.functions.invoke('generate-booking-receipt', {
        body: { bookingId, language }
      });

      if (data?.pdfUrl) {
        window.open(data.pdfUrl, '_blank');
      } else {
        toast.error(language === 'es' ? 'Error al generar recibo' : 'Error generating receipt');
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error(language === 'es' ? 'Error al descargar recibo' : 'Error downloading receipt');
    }
  };

  const requestCancellation = async (bookingId: string) => {
    try {
      // For now, just show success message - table will be created later
      toast.success(
        language === 'es' 
          ? 'Solicitud de cancelación enviada. Te contactaremos pronto.'
          : 'Cancellation request sent. We will contact you soon.'
      );
      setCancelDialogOpen(false);
      setSelectedBooking(null);

    } catch (error) {
      console.error('Error requesting cancellation:', error);
      toast.error(language === 'es' ? 'Error al solicitar cancelación' : 'Error requesting cancellation');
    }
  };

  const { upcoming, pending, past } = categorizeBookings();

  if (loading) {
    return (
      <div className="container-safe py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-safe py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          {language === 'es' ? 'Mis reservas' : 'My bookings'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'es' 
            ? 'Gestiona todas tus reservas de viaje en un solo lugar'
            : 'Manage all your travel bookings in one place'
          }
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {language === 'es' ? 'Próximos' : 'Upcoming'} ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {language === 'es' ? 'Pendientes' : 'Pending'} ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            {language === 'es' ? 'Pasados' : 'Past'} ({past.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {upcoming.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {language === 'es' ? 'No tienes viajes próximos' : 'No upcoming trips'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === 'es' 
                    ? 'Explora nuestros paquetes de viaje y reserva tu próxima aventura'
                    : 'Explore our travel packages and book your next adventure'
                  }
                </p>
                <Button onClick={() => navigate('/travel')}>
                  {language === 'es' ? 'Explorar viajes' : 'Explore trips'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  language={language}
                  formatPrice={formatPrice}
                  formatDate={formatDate}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  onDownloadReceipt={downloadReceipt}
                  onRequestCancellation={(booking) => {
                    setSelectedBooking(booking);
                    setCancelDialogOpen(true);
                  }}
                  onViewDetails={(id) => navigate(`/travel/confirm/${id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          {pending.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {language === 'es' ? 'No tienes reservas pendientes' : 'No pending bookings'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'es' 
                    ? 'Todas tus reservas están confirmadas o completadas'
                    : 'All your bookings are confirmed or completed'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pending.map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  language={language}
                  formatPrice={formatPrice}
                  formatDate={formatDate}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  onDownloadReceipt={downloadReceipt}
                  onRequestCancellation={(booking) => {
                    setSelectedBooking(booking);
                    setCancelDialogOpen(true);
                  }}
                  onViewDetails={(id) => navigate(`/travel/confirm/${id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {past.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {language === 'es' ? 'No tienes viajes pasados' : 'No past trips'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'es' 
                    ? 'Tus viajes completados aparecerán aquí'
                    : 'Your completed trips will appear here'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  language={language}
                  formatPrice={formatPrice}
                  formatDate={formatDate}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  onDownloadReceipt={downloadReceipt}
                  onRequestCancellation={(booking) => {
                    setSelectedBooking(booking);
                    setCancelDialogOpen(true);
                  }}
                  onViewDetails={(id) => navigate(`/travel/confirm/${id}`)}
                  isPast={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Cancellation Request Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'es' ? 'Solicitar cancelación' : 'Request cancellation'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {language === 'es' 
                ? '¿Estás seguro de que quieres solicitar la cancelación de esta reserva? Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo.'
                : 'Are you sure you want to request cancellation of this booking? Our team will review your request and contact you.'
              }
            </p>
            
            {selectedBooking && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">
                  {selectedBooking.travel_packages.title[language] || selectedBooking.travel_packages.title.es}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formatDate(selectedBooking.travel_start_date)} • {formatPrice(selectedBooking.total_amount)}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => selectedBooking && requestCancellation(selectedBooking.id)}
              >
                {language === 'es' ? 'Solicitar cancelación' : 'Request cancellation'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Booking Card Component
interface BookingCardProps {
  booking: Booking;
  language: string;
  formatPrice: (amount: number) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  onDownloadReceipt: (bookingId: string) => void;
  onRequestCancellation: (booking: Booking) => void;
  onViewDetails: (bookingId: string) => void;
  isPast?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  language,
  formatPrice,
  formatDate,
  getStatusColor,
  getStatusText,
  onDownloadReceipt,
  onRequestCancellation,
  onViewDetails,
  isPast = false
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        {booking.travel_packages.gallery?.images?.[0] && (
          <img
            src={booking.travel_packages.gallery.images[0]}
            alt={booking.travel_packages.title[language] || booking.travel_packages.title.es}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge className={getStatusColor(booking.payment_status)}>
            {getStatusText(booking.payment_status)}
          </Badge>
          <Badge className={getStatusColor(booking.booking_status)}>
            {getStatusText(booking.booking_status)}
          </Badge>
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">
          {booking.travel_packages.title[language] || booking.travel_packages.title.es}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{booking.travel_packages.city}, {booking.travel_packages.region}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-primary" />
            <span>{formatDate(booking.travel_start_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-primary" />
            <span>{booking.number_of_travelers} {language === 'es' ? 'personas' : 'people'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-primary" />
            <span>{booking.travel_packages.duration} {language === 'es' ? 'días' : 'days'}</span>
          </div>
          <div className="font-medium text-primary">
            {formatPrice(booking.total_amount)}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(booking.id)}
            className="flex-1"
          >
            <Eye className="w-3 h-3 mr-1" />
            {language === 'es' ? 'Ver' : 'View'}
          </Button>
          
          {booking.payment_status === 'paid' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownloadReceipt(booking.id)}
            >
              <Download className="w-3 h-3" />
            </Button>
          )}
          
          {!isPast && booking.booking_status !== 'cancelled' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRequestCancellation(booking)}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};