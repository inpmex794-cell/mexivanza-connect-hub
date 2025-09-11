import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, CreditCard } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface TravelPackage {
  id: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  region: string;
  city: string;
  duration: number;
  pricing_tiers: {
    standard: { price: number; currency: string; includes: string[] };
    premium: { price: number; currency: string; includes: string[] };
  };
}

interface TravelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: TravelPackage;
}

export const TravelBookingModal: React.FC<TravelBookingModalProps> = ({
  isOpen,
  onClose,
  package: pkg
}) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'standard' | 'premium'>('standard');
  
  const [formData, setFormData] = useState({
    traveler_name: user?.user_metadata?.full_name || '',
    traveler_email: user?.email || '',
    traveler_whatsapp: '',
    travel_start_date: '',
    travel_end_date: '',
    number_of_travelers: '1',
    special_requests: ''
  });

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: currency === 'MXN' ? 'MXN' : 'USD',
    }).format(price);
  };

  const selectedPricing = pkg.pricing_tiers?.[selectedTier];
  const totalAmount = selectedPricing ? selectedPricing.price * parseInt(formData.number_of_travelers) : 0;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-calculate end date when start date changes
    if (field === 'travel_start_date' && value && pkg.duration) {
      const startDate = new Date(value);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + pkg.duration - 1);
      setFormData(prev => ({ 
        ...prev, 
        travel_end_date: endDate.toISOString().split('T')[0] 
      }));
    }
  };

  const validateForm = () => {
    const required = ['traveler_name', 'traveler_email', 'travel_start_date', 'travel_end_date'];
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
        package_id: pkg.id,
        package_title: pkg.title[language],
        duration: pkg.duration,
        total_amount: totalAmount,
        ...formData,
        number_of_travelers: parseInt(formData.number_of_travelers)
      };

      const { data, error } = await supabase.functions.invoke('create-travel-payment', {
        body: { bookingData }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t('travel.book_package', 'Book Travel Package')}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Package Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {pkg.title[language]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {pkg.city}, {pkg.region}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {pkg.duration} {t('travel.days', 'days')}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>{t('travel.select_package', 'Select Package Type')}</Label>
                  <div className="space-y-3">
                    {Object.entries(pkg.pricing_tiers || {}).map(([tier, pricing]) => (
                      <Card 
                        key={tier}
                        className={`cursor-pointer transition-colors ${
                          selectedTier === tier ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedTier(tier as 'standard' | 'premium')}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <Badge variant={tier === 'premium' ? 'default' : 'secondary'}>
                                {tier === 'premium' ? t('travel.premium', 'Premium') : t('travel.standard', 'Standard')}
                              </Badge>
                              <div className="font-semibold text-lg mt-1">
                                {formatPrice(pricing.price, pricing.currency)}
                              </div>
                            </div>
                            <input
                              type="radio"
                              checked={selectedTier === tier}
                              onChange={() => setSelectedTier(tier as 'standard' | 'premium')}
                              className="mt-1"
                            />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div className="font-medium mb-1">{t('travel.includes', 'Includes')}:</div>
                            <ul className="space-y-1">
                              {pricing.includes?.map((item, idx) => (
                                <li key={idx} className="flex items-center">
                                  <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="traveler_name">{t('travel.name', 'Full Name')} *</Label>
                    <Input
                      id="traveler_name"
                      value={formData.traveler_name}
                      onChange={(e) => handleInputChange('traveler_name', e.target.value)}
                      placeholder={t('travel.name_placeholder', 'Enter full name')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="traveler_email">{t('travel.email', 'Email')} *</Label>
                    <Input
                      id="traveler_email"
                      type="email"
                      value={formData.traveler_email}
                      onChange={(e) => handleInputChange('traveler_email', e.target.value)}
                      placeholder={t('travel.email_placeholder', 'Enter email')}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="traveler_whatsapp">{t('travel.whatsapp', 'WhatsApp')} ({t('travel.optional', 'Optional')})</Label>
                  <Input
                    id="traveler_whatsapp"
                    value={formData.traveler_whatsapp}
                    onChange={(e) => handleInputChange('traveler_whatsapp', e.target.value)}
                    placeholder="+52 55 1234 5678"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="travel_start_date">{t('travel.start_date', 'Start Date')} *</Label>
                    <Input
                      id="travel_start_date"
                      type="date"
                      value={formData.travel_start_date}
                      onChange={(e) => handleInputChange('travel_start_date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="travel_end_date">{t('travel.end_date', 'End Date')} *</Label>
                    <Input
                      id="travel_end_date"
                      type="date"
                      value={formData.travel_end_date}
                      onChange={(e) => handleInputChange('travel_end_date', e.target.value)}
                      min={formData.travel_start_date}
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="number_of_travelers">{t('travel.travelers', 'Number of Travelers')}</Label>
                  <Select value={formData.number_of_travelers} onValueChange={(value) => handleInputChange('number_of_travelers', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? t('travel.traveler', 'traveler') : t('travel.travelers_plural', 'travelers')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="special_requests">{t('travel.special_requests', 'Special Requests')}</Label>
                  <Textarea
                    id="special_requests"
                    value={formData.special_requests}
                    onChange={(e) => handleInputChange('special_requests', e.target.value)}
                    placeholder={t('travel.requests_placeholder', 'Any special dietary requirements, accessibility needs, etc.')}
                    rows={3}
                  />
                </div>

                {/* Price Summary */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('travel.package_price', 'Package Price')}</span>
                        <span>{formatPrice(selectedPricing?.price || 0, selectedPricing?.currency || 'MXN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t('travel.travelers', 'Travelers')}</span>
                        <span>× {formData.number_of_travelers}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>{t('travel.total', 'Total')}</span>
                        <span className="text-primary">{formatPrice(totalAmount, selectedPricing?.currency || 'MXN')}</span>
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