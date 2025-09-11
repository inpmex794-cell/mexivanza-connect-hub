import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/page-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, MapPin, Users, CreditCard, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const BookingSuccessPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-travel-payment', {
        body: { session_id: sessionId }
      });

      if (error) throw error;

      if (data.success) {
        setBooking(data.booking);
        toast({
          title: t('travel.booking_confirmed', 'Booking Confirmed!'),
          description: t('travel.payment_successful', 'Your payment was processed successfully'),
        });
      } else {
        toast({
          title: t('error.payment_failed', 'Payment Failed'),
          description: t('travel.payment_failed_desc', 'There was an issue with your payment'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: t('error.general', 'Error'),
        description: t('travel.verification_error', 'Failed to verify payment'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'es' ? 'es-MX' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t('travel.verifying_payment', 'Verifying your payment...')}</p>
        </div>
      </PageLayout>
    );
  }

  if (!sessionId || !booking) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t('travel.invalid_booking', 'Invalid Booking')}
          </h1>
          <p className="text-muted-foreground mb-8">
            {t('travel.booking_not_found', 'We could not find your booking information')}
          </p>
          <Button asChild>
            <Link to="/travel/packages">
              {t('travel.browse_packages', 'Browse Packages')}
            </Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              {t('travel.booking_confirmed', 'Booking Confirmed!')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('travel.confirmation_message', 'Thank you for your booking. We\'ll be in touch soon with your travel details.')}
            </p>
          </div>

          {/* Booking Details Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {t('travel.booking_details', 'Booking Details')}
              </CardTitle>
              <CardDescription>
                {t('travel.booking_reference', 'Booking Reference')}: {booking.id.slice(0, 8).toUpperCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">{t('travel.traveler_info', 'Traveler Information')}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong>{t('travel.name', 'Name')}:</strong> {booking.traveler_name}</p>
                      <p><strong>{t('travel.email', 'Email')}:</strong> {booking.traveler_email}</p>
                      {booking.traveler_whatsapp && (
                        <p><strong>{t('travel.whatsapp', 'WhatsApp')}:</strong> {booking.traveler_whatsapp}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">{t('travel.trip_details', 'Trip Details')}</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {formatDate(booking.travel_start_date)} - {formatDate(booking.travel_end_date)}
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
                </div>

                <div className="space-y-4">
                  {booking.special_requests && (
                    <div>
                      <h4 className="font-medium mb-2">{t('travel.special_requests', 'Special Requests')}</h4>
                      <p className="text-sm bg-muted p-3 rounded-lg">
                        {booking.special_requests}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-2">{t('travel.next_steps', 'Next Steps')}</h4>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>• {t('travel.confirmation_email', 'You will receive a confirmation email shortly')}</p>
                      <p>• {t('travel.contact_soon', 'Our team will contact you within 24 hours')}</p>
                      <p>• {t('travel.itinerary_sent', 'Detailed itinerary will be sent 1 week before travel')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/dashboard">
                {t('travel.view_dashboard', 'View My Bookings')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/travel/packages">
                {t('travel.browse_more', 'Browse More Packages')}
              </Link>
            </Button>
          </div>

          {/* Support Information */}
          <Card className="mt-8 bg-muted/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <h4 className="font-medium mb-2">{t('travel.need_help', 'Need Help?')}</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('travel.support_message', 'Our travel specialists are here to help you plan the perfect trip')}
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://wa.me/525512345678" target="_blank" rel="noopener noreferrer">
                      {t('travel.whatsapp_support', 'WhatsApp Support')}
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="mailto:travel@mexivanza.com">
                      {t('travel.email_support', 'Email Support')}
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default BookingSuccessPage;