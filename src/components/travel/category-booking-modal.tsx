import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plane, Hotel, Shield, Ship, Home, MapPin as Guide, 
  Bus, Car, Calendar, Clock, MapPin, Users, CreditCard, Star 
} from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface TravelListing {
  id: string;
  category: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  provider_name: string;
  location: string;
  price_amount: number;
  price_currency: string;
  scenario_tags: string[];
  featured: boolean;
  category_data: any;
  availability: number;
  gallery: { images: Array<{ url: string; caption: { es: string; en: string } }> };
  reviews: { rating: number; count: number };
}

interface CategoryBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: TravelListing;
}

export const CategoryBookingModal: React.FC<CategoryBookingModalProps> = ({
  isOpen,
  onClose,
  listing
}) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    contact_name: user?.user_metadata?.full_name || '',
    contact_email: user?.email || '',
    contact_phone: '',
    booking_dates: {
      start_date: '',
      end_date: '',
      duration: '1'
    },
    special_requests: '',
    // Category-specific fields will be added here
    category_specific: {} as any
  });

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: currency === 'MXN' ? 'MXN' : 'USD',
    }).format(price);
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      flights: Plane,
      hotels: Hotel,
      insurance: Shield,
      cruises: Ship,
      airbnb: Home,
      tour_guides: Guide,
      charters: Bus,
      car_rentals: Car
    };
    return icons[category as keyof typeof icons] || Star;
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent as keyof typeof prev], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleCategorySpecificChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      category_specific: { ...prev.category_specific, [field]: value }
    }));
  };

  const calculateTotal = () => {
    let basePrice = listing.price_amount;
    
    // Add category-specific pricing logic
    switch (listing.category) {
      case 'flights':
        const passengers = parseInt(formData.category_specific.passengers || '1');
        return basePrice * passengers;
      case 'hotels':
      case 'airbnb':
        const nights = calculateNights();
        return basePrice * nights;
      case 'tour_guides':
      case 'charters':
        const hours = parseInt(formData.category_specific.duration_hours || '1');
        return basePrice * hours;
      case 'car_rentals':
        const days = calculateNights() || 1;
        return basePrice * days;
      default:
        return basePrice;
    }
  };

  const calculateNights = () => {
    if (!formData.booking_dates.start_date || !formData.booking_dates.end_date) return 1;
    const start = new Date(formData.booking_dates.start_date);
    const end = new Date(formData.booking_dates.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const validateForm = () => {
    const required = ['contact_name', 'contact_email'];
    return required.every(field => formData[field as keyof typeof formData]);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: t('error.validation', 'Validation Error'),
        description: t('travel.fill_required', 'Please fill in all required fields'),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const bookingData = {
        listing_id: listing.id,
        category: listing.category,
        booking_data: {
          ...formData.category_specific,
          dates: formData.booking_dates,
          special_requests: formData.special_requests
        },
        total_amount: calculateTotal(),
        booking_dates: formData.booking_dates,
        contact_info: {
          name: formData.contact_name,
          email: formData.contact_email,
          phone: formData.contact_phone
        },
        special_requests: formData.special_requests
      };

      const { data, error } = await supabase.functions.invoke('create-category-booking', {
        body: { bookingData }
      });

      if (error) throw error;

      // Open payment window if needed
      if (data.url) {
        window.open(data.url, '_blank');
        onClose();
        toast({
          title: t('travel.booking_initiated', 'Booking Initiated'),
          description: t('travel.payment_window', 'Payment window opened. Complete your booking there.'),
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: t('error.booking', 'Booking Error'),
        description: t('travel.booking_failed', 'Failed to create booking. Please try again.'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCategorySpecificFields = () => {
    switch (listing.category) {
      case 'flights':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('travel.passengers', 'Passengers')}</Label>
                <Select 
                  value={formData.category_specific.passengers || '1'}
                  onValueChange={(value) => handleCategorySpecificChange('passengers', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t('travel.class', 'Class')}</Label>
                <Select 
                  value={formData.category_specific.class || 'economy'}
                  onValueChange={(value) => handleCategorySpecificChange('class', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">{t('travel.economy', 'Economy')}</SelectItem>
                    <SelectItem value="premium">{t('travel.premium', 'Premium')}</SelectItem>
                    <SelectItem value="business">{t('travel.business', 'Business')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('travel.departure_date', 'Departure Date')}</Label>
                <Input
                  type="date"
                  value={formData.booking_dates.start_date}
                  onChange={(e) => handleInputChange('booking_dates.start_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label>{t('travel.return_date', 'Return Date')} ({t('travel.optional', 'Optional')})</Label>
                <Input
                  type="date"
                  value={formData.booking_dates.end_date}
                  onChange={(e) => handleInputChange('booking_dates.end_date', e.target.value)}
                  min={formData.booking_dates.start_date}
                />
              </div>
            </div>
          </div>
        );

      case 'hotels':
      case 'airbnb':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('travel.check_in', 'Check-in Date')}</Label>
                <Input
                  type="date"
                  value={formData.booking_dates.start_date}
                  onChange={(e) => handleInputChange('booking_dates.start_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label>{t('travel.check_out', 'Check-out Date')}</Label>
                <Input
                  type="date"
                  value={formData.booking_dates.end_date}
                  onChange={(e) => handleInputChange('booking_dates.end_date', e.target.value)}
                  min={formData.booking_dates.start_date}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('travel.guests', 'Guests')}</Label>
                <Select 
                  value={formData.category_specific.guests || '2'}
                  onValueChange={(value) => handleCategorySpecificChange('guests', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {listing.category === 'hotels' && (
                <div>
                  <Label>{t('travel.room_type', 'Room Type')}</Label>
                  <Select 
                    value={formData.category_specific.room_type || 'standard'}
                    onValueChange={(value) => handleCategorySpecificChange('room_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">{t('travel.standard', 'Standard')}</SelectItem>
                      <SelectItem value="suite">{t('travel.suite', 'Suite')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        );

      case 'tour_guides':
      case 'charters':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('travel.service_date', 'Service Date')}</Label>
                <Input
                  type="date"
                  value={formData.booking_dates.start_date}
                  onChange={(e) => handleInputChange('booking_dates.start_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label>{t('travel.duration_hours', 'Duration (hours)')}</Label>
                <Select 
                  value={formData.category_specific.duration_hours || '4'}
                  onValueChange={(value) => handleCategorySpecificChange('duration_hours', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2,4,6,8,10,12].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num} {t('travel.hours', 'hours')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>{t('travel.group_size', 'Group Size')}</Label>
              <Select 
                value={formData.category_specific.group_size || '4'}
                onValueChange={(value) => handleCategorySpecificChange('group_size', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,8,10,12,15].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num} {t('travel.people', 'people')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'car_rentals':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('travel.pickup_date', 'Pickup Date')}</Label>
                <Input
                  type="date"
                  value={formData.booking_dates.start_date}
                  onChange={(e) => handleInputChange('booking_dates.start_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label>{t('travel.return_date', 'Return Date')}</Label>
                <Input
                  type="date"
                  value={formData.booking_dates.end_date}
                  onChange={(e) => handleInputChange('booking_dates.end_date', e.target.value)}
                  min={formData.booking_dates.start_date}
                />
              </div>
            </div>
            <div>
              <Label>{t('travel.pickup_location', 'Pickup Location')}</Label>
              <Select 
                value={formData.category_specific.pickup_location || 'airport'}
                onValueChange={(value) => handleCategorySpecificChange('pickup_location', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="airport">{t('travel.airport', 'Airport')}</SelectItem>
                  <SelectItem value="hotel">{t('travel.hotel', 'Hotel')}</SelectItem>
                  <SelectItem value="downtown">{t('travel.downtown', 'Downtown')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('travel.service_date', 'Service Date')}</Label>
                <Input
                  type="date"
                  value={formData.booking_dates.start_date}
                  onChange={(e) => handleInputChange('booking_dates.start_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label>{t('travel.end_date', 'End Date')} ({t('travel.optional', 'Optional')})</Label>
                <Input
                  type="date"
                  value={formData.booking_dates.end_date}
                  onChange={(e) => handleInputChange('booking_dates.end_date', e.target.value)}
                  min={formData.booking_dates.start_date}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  const Icon = getCategoryIcon(listing.category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {t('travel.book_service', 'Book Service')}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Service Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {listing.title[language]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {listing.location}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>{t('travel.provider', 'Provider')}:</strong> {listing.provider_name}
                  </div>
                  <p className="text-sm">{listing.description[language]}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {listing.scenario_tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {listing.reviews?.rating > 0 && (
                  <div className="flex items-center text-sm mb-4">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{listing.reviews.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground ml-1">
                      ({listing.reviews.count} {t('travel.reviews', 'reviews')})
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {t('travel.booking_details', 'Booking Details')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_name">{t('travel.name', 'Full Name')} *</Label>
                    <Input
                      id="contact_name"
                      value={formData.contact_name}
                      onChange={(e) => handleInputChange('contact_name', e.target.value)}
                      placeholder={t('travel.name_placeholder', 'Enter full name')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_email">{t('travel.email', 'Email')} *</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      placeholder={t('travel.email_placeholder', 'Enter email')}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contact_phone">{t('travel.phone', 'Phone')} ({t('travel.optional', 'Optional')})</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    placeholder="+52 55 1234 5678"
                  />
                </div>

                {/* Category-Specific Fields */}
                {renderCategorySpecificFields()}

                <div>
                  <Label htmlFor="special_requests">{t('travel.special_requests', 'Special Requests')}</Label>
                  <Textarea
                    id="special_requests"
                    value={formData.special_requests}
                    onChange={(e) => handleInputChange('special_requests', e.target.value)}
                    placeholder={t('travel.requests_placeholder', 'Any special requirements...')}
                    rows={3}
                  />
                </div>

                {/* Price Summary */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('travel.base_price', 'Base Price')}</span>
                        <span>{formatPrice(listing.price_amount, listing.price_currency)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>{t('travel.total', 'Total')}</span>
                        <span className="text-primary">{formatPrice(calculateTotal(), listing.price_currency)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !validateForm()}
                  className="w-full"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isSubmitting 
                    ? t('travel.processing', 'Processing...') 
                    : t('travel.proceed_payment', 'Proceed to Payment')
                  }
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};