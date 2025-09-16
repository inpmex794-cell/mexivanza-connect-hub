import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { CheckCircle, Download, Mail, MapPin, Calendar, Users, Clock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface BookingDetails {
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
    title: any;
    description: any;
    region: string;
    city: string;
    duration: number;
    gallery: any;
  };
}

export const BookingConfirmation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchBookingDetails();
  }, [bookingId, user]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('travel_bookings')
        .select(`
          *,
          travel_packages (
            title,
            description,
            region,
            city,
            duration,
            gallery
          )
        `)
        .eq('id', bookingId)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      
      setBooking(data);
      
      // Send confirmation email if payment is completed
      if (data.payment_status === 'paid' && !emailSent) {
        await sendConfirmationEmail(data);
        setEmailSent(true);
      }

    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error(language === 'es' ? 'Error al cargar la reserva' : 'Error loading booking');
      navigate('/account/bookings');
    } finally {
      setLoading(false);
    }
  };

  const sendConfirmationEmail = async (bookingData: BookingDetails) => {
    try {
      await supabase.functions.invoke('send-booking-confirmation', {
        body: {
          bookingId: bookingData.id,
          userEmail: bookingData.traveler_email,
          packageTitle: bookingData.travel_packages.title[language] || bookingData.travel_packages.title.es,
          totalAmount: bookingData.total_amount,
          travelDates: {
            start: bookingData.travel_start_date,
            end: bookingData.travel_end_date
          },
          travelers: bookingData.number_of_travelers,
          language
        }
      });
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

  const downloadReceipt = async () => {
    try {
      const { data } = await supabase.functions.invoke('generate-booking-receipt', {
        body: { bookingId: booking?.id, language }
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

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'es' ? 'es-MX' : 'en-US',
      { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">
            {language === 'es' ? 'Cargando confirmación...' : 'Loading confirmation...'}
          </p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              {language === 'es' ? 'Reserva no encontrada' : 'Booking not found'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/account/bookings')} className="mt-4">
              {language === 'es' ? 'Ver mis reservas' : 'View my bookings'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/account/bookings')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Volver a mis reservas' : 'Back to my bookings'}
          </Button>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                {booking.payment_status === 'paid' 
                  ? (language === 'es' ? '¡Reserva confirmada!' : 'Booking confirmed!')
                  : (language === 'es' ? 'Reserva creada' : 'Booking created')
                }
              </h1>
              <p className="text-muted-foreground">
                {booking.payment_status === 'paid'
                  ? (language === 'es' 
                      ? 'Tu pago ha sido procesado exitosamente'
                      : 'Your payment has been processed successfully'
                    )
                  : (language === 'es'
                      ? 'Completa el pago para confirmar tu reserva'
                      : 'Complete payment to confirm your booking'
                    )
                }
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Badge className={getStatusColor(booking.payment_status)}>
                {language === 'es' ? 'Pago:' : 'Payment:'} {getStatusText(booking.payment_status)}
              </Badge>
              <Badge className={getStatusColor(booking.booking_status)}>
                {language === 'es' ? 'Estado:' : 'Status:'} {getStatusText(booking.booking_status)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {language === 'es' ? 'Detalles del viaje' : 'Trip details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  {booking.travel_packages.gallery?.images?.[0] && (
                    <img
                      src={booking.travel_packages.gallery.images[0]}
                      alt={booking.travel_packages.title[language] || booking.travel_packages.title.es}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-semibold mb-1">
                      {booking.travel_packages.title?.[language] || booking.travel_packages.title?.es || 'Travel Package'}
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      {booking.travel_packages.city}, {booking.travel_packages.region}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.travel_packages.description?.[language] || booking.travel_packages.description?.es || ''}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">
                        {language === 'es' ? 'Fecha de inicio' : 'Start date'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(booking.travel_start_date)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">
                        {language === 'es' ? 'Duración' : 'Duration'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.travel_packages.duration} {language === 'es' ? 'días' : 'days'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">
                        {language === 'es' ? 'Viajeros' : 'Travelers'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.number_of_travelers} {language === 'es' ? 'personas' : 'people'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Information */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'es' ? 'Información de la reserva' : 'Booking information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      {language === 'es' ? 'ID de reserva' : 'Booking ID'}
                    </Label>
                    <p className="text-sm font-mono">{booking.id}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      {language === 'es' ? 'Fecha de reserva' : 'Booking date'}
                    </Label>
                    <p className="text-sm">
                      {new Date(booking.created_at).toLocaleDateString(
                        language === 'es' ? 'es-MX' : 'en-US'
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      {language === 'es' ? 'Nombre del viajero principal' : 'Lead traveler name'}
                    </Label>
                    <p className="text-sm">{booking.traveler_name}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      {language === 'es' ? 'Email de contacto' : 'Contact email'}
                    </Label>
                    <p className="text-sm">{booking.traveler_email}</p>
                  </div>
                </div>

                {booking.special_requests && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      {language === 'es' ? 'Solicitudes especiales' : 'Special requests'}
                    </Label>
                    <p className="text-sm mt-1 p-3 bg-muted rounded-lg">
                      {booking.special_requests}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Next Steps */}
            {booking.payment_status === 'paid' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    {language === 'es' ? 'Próximos pasos' : 'Next steps'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-primary">1</span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {language === 'es' ? 'Confirmación por email' : 'Email confirmation'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'es' 
                            ? 'Recibirás un email de confirmación con todos los detalles del viaje'
                            : 'You will receive a confirmation email with all trip details'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-primary">2</span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {language === 'es' ? 'Contacto del equipo' : 'Team contact'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'es' 
                            ? 'Nuestro equipo se pondrá en contacto contigo 48-72 horas antes del viaje'
                            : 'Our team will contact you 48-72 hours before your trip'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-primary">3</span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {language === 'es' ? 'Preparación del viaje' : 'Trip preparation'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'es' 
                            ? 'Te enviaremos información detallada sobre el itinerario y recomendaciones'
                            : 'We will send you detailed information about the itinerary and recommendations'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>
                  {language === 'es' ? 'Resumen de pago' : 'Payment summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">{language === 'es' ? 'Subtotal:' : 'Subtotal:'}</span>
                  <span className="text-sm">{formatPrice(booking.total_amount)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>{language === 'es' ? 'Total pagado:' : 'Total paid:'}</span>
                  <span className="text-primary">{formatPrice(booking.total_amount)}</span>
                </div>

                <div className="space-y-2 pt-4">
                  <Button 
                    onClick={downloadReceipt}
                    variant="outline" 
                    className="w-full"
                    disabled={booking.payment_status !== 'paid'}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {language === 'es' ? 'Descargar recibo' : 'Download receipt'}
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/account/bookings')}
                    className="w-full"
                  >
                    {language === 'es' ? 'Ver todas mis reservas' : 'View all my bookings'}
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">
                    {language === 'es' ? '¿Necesitas ayuda?' : 'Need help?'}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {language === 'es' 
                      ? 'Nuestro equipo está aquí para ayudarte'
                      : 'Our team is here to help you'
                    }
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    {language === 'es' ? 'Contactar soporte' : 'Contact support'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};