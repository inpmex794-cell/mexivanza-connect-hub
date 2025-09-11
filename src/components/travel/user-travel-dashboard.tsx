import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Users, CreditCard, Phone, Mail, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface Booking {
  id: string;
  package_id: string;
  traveler_name: string;
  traveler_email: string;
  traveler_whatsapp: string;
  travel_start_date: string;
  travel_end_date: string;
  number_of_travelers: number;
  special_requests: string;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  booking_status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  travel_packages: {
    title: { es: string; en: string };
    duration: number;
    city: string;
    region: string;
  };
}

export const UserTravelDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_bookings')
        .select(`
          *,
          travel_packages (
            title,
            duration,
            city,
            region
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings((data as any) || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: t('error.general', 'Error'),
        description: t('travel.fetch_bookings_error', 'Failed to load your bookings'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'es' ? 'es-MX' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.travel_start_date) > new Date() && 
    booking.booking_status === 'confirmed'
  );

  const pastBookings = bookings.filter(booking => 
    new Date(booking.travel_end_date) < new Date()
  );

  const pendingBookings = bookings.filter(booking => 
    booking.booking_status === 'pending' || booking.payment_status === 'pending'
  );

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {t('travel.login_required', 'Login Required')}
        </h2>
        <p className="text-muted-foreground">
          {t('travel.login_to_view', 'Please log in to view your travel bookings')}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-3 bg-muted rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('travel.my_bookings', 'My Travel Bookings')}
        </h1>
        <p className="text-muted-foreground">
          {t('travel.dashboard_subtitle', 'Manage your travel bookings and view trip details')}
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            {t('travel.upcoming', 'Upcoming')} ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            {t('travel.pending', 'Pending')} ({pendingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            {t('travel.past', 'Past')} ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6 mt-6">
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t('travel.no_upcoming', 'No upcoming trips')}
                </h3>
                <p className="text-muted-foreground">
                  {t('travel.book_new_trip', 'Book a new travel package to see it here')}
                </p>
              </CardContent>
            </Card>
          ) : (
            upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-6 mt-6">
          {pendingBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t('travel.no_pending', 'No pending bookings')}
                </h3>
                <p className="text-muted-foreground">
                  {t('travel.all_confirmed', 'All your bookings are confirmed')}
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6 mt-6">
          {pastBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t('travel.no_past', 'No past trips')}
                </h3>
                <p className="text-muted-foreground">
                  {t('travel.start_traveling', 'Start your travel journey with us!')}
                </p>
              </CardContent>
            </Card>
          ) : (
            pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
  const { t, language } = useLanguage();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'es' ? 'es-MX' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">
              {booking.travel_packages?.title?.[language] || 'Travel Package'}
            </CardTitle>
            <CardDescription className="flex items-center mt-2">
              <MapPin className="w-4 h-4 mr-1" />
              {booking.travel_packages?.city}, {booking.travel_packages?.region}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(booking.booking_status)}>
              {t(`travel.status_${booking.booking_status}`, booking.booking_status)}
            </Badge>
            <Badge className={getStatusColor(booking.payment_status)}>
              {t(`travel.payment_${booking.payment_status}`, booking.payment_status)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">
                {t('travel.trip_details', 'Trip Details')}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  {formatDate(booking.travel_start_date)} - {formatDate(booking.travel_end_date)}
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                  {booking.travel_packages?.duration} {t('travel.days', 'days')}
                </div>
                <div className="flex items-center text-sm">
                  <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                  {booking.number_of_travelers} {booking.number_of_travelers === 1 ? t('travel.traveler', 'traveler') : t('travel.travelers_plural', 'travelers')}
                </div>
                <div className="flex items-center text-sm">
                  <CreditCard className="w-4 h-4 mr-2 text-muted-foreground" />
                  {formatPrice(booking.total_amount)}
                </div>
              </div>
            </div>

            {booking.special_requests && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                  {t('travel.special_requests', 'Special Requests')}
                </h4>
                <p className="text-sm bg-muted p-3 rounded-lg">
                  {booking.special_requests}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">
                {t('travel.contact_info', 'Contact Information')}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                  {booking.traveler_email}
                </div>
                {booking.traveler_whatsapp && (
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                    {booking.traveler_whatsapp}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">
                {t('travel.booking_id', 'Booking ID')}
              </h4>
              <p className="text-sm font-mono bg-muted p-2 rounded">
                {booking.id.slice(0, 8)}...
              </p>
            </div>

            {booking.booking_status === 'confirmed' && (
              <div className="pt-2">
                <Button size="sm" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t('travel.contact_support', 'Contact Support')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};