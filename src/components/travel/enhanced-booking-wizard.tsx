import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, Users, MapPin, Clock, Star, CreditCard, ArrowLeft, ArrowRight, Plus, Minus, Check, X, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';

interface TravelPackage {
  id: string;
  title: any;
  description: any;
  region: string;
  city: string;
  duration: number;
  pricing_tiers: any;
  gallery: any;
  itinerary?: any;
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

interface BookingFormData {
  selectedDate: Date | null;
  availabilityId: string | null;
  travelers: Array<{ name: string; age: number }>;
  selectedExtras: Array<{ extraId: string; quantity: number }>;
  specialRequests: string;
  totalAmount: number;
  contactInfo: {
    travelerName: string;
    travelerEmail: string;
    travelerWhatsapp: string;
  };
}

interface BookingWizardProps {
  onBookingComplete?: (bookingId: string) => void;
}

export const EnhancedBookingWizard: React.FC<BookingWizardProps> = ({ onBookingComplete }) => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [travelPackage, setTravelPackage] = useState<TravelPackage | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [extras, setExtras] = useState<TravelExtra[]>([]);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    selectedDate: null,
    availabilityId: null,
    travelers: [{ name: '', age: 0 }],
    selectedExtras: [],
    specialRequests: '',
    totalAmount: 0,
    contactInfo: {
      travelerName: user?.user_metadata?.full_name || '',
      travelerEmail: user?.email || '',
      travelerWhatsapp: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const steps = [
    { 
      number: 1, 
      title: language === 'es' ? 'Fecha' : 'Date', 
      description: language === 'es' ? 'Selecciona tu fecha de viaje' : 'Select your travel date' 
    },
    { 
      number: 2, 
      title: language === 'es' ? 'Viajeros' : 'Travelers', 
      description: language === 'es' ? 'Información de viajeros' : 'Traveler information' 
    },
    { 
      number: 3, 
      title: language === 'es' ? 'Extras' : 'Extras', 
      description: language === 'es' ? 'Servicios adicionales' : 'Additional services' 
    },
    { 
      number: 4, 
      title: language === 'es' ? 'Pago' : 'Payment', 
      description: language === 'es' ? 'Confirmar y pagar' : 'Confirm and pay' 
    }
  ];

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (packageId) {
      fetchPackageData();
    }
  }, [packageId, user]);

  useEffect(() => {
    calculateTotalPrice();
  }, [bookingData.travelers, bookingData.selectedExtras, bookingData.selectedDate]);

  const fetchPackageData = async () => {
    try {
      setLoading(true);
      
      // Fetch package
      const { data: packageData, error: packageError } = await supabase
        .from('travel_packages')
        .select('*')
        .eq('id', packageId)
        .eq('is_published', true)
        .single();

      if (packageError) throw packageError;
      setTravelPackage(packageData);

      // Mock availability data for demo
      const mockAvailability = [
        {
          id: '1',
          package_id: packageId!,
          available_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          capacity: 10,
          booked_count: 2,
          price_multiplier: 1
        },
        {
          id: '2', 
          package_id: packageId!,
          available_date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          capacity: 8,
          booked_count: 1,
          price_multiplier: 1.2
        }
      ];
      setAvailability(mockAvailability);

      // Mock extras data for demo
      const mockExtras = [
        {
          id: '1',
          name: { es: 'Seguro de viaje', en: 'Travel insurance' },
          description: { es: 'Cobertura completa', en: 'Full coverage' },
          price: 500,
          per_person: true,
          category: 'Insurance'
        }
      ];
      setExtras(mockExtras);

    } catch (error) {
      console.error('Error fetching package data:', error);
      toast.error(language === 'es' ? 'Error al cargar paquete' : 'Error loading package');
      navigate('/travel');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!travelPackage || !bookingData.selectedDate) return;

    const selectedAvailability = availability.find(a => 
      new Date(a.available_date).toDateString() === bookingData.selectedDate?.toDateString()
    );

    if (!selectedAvailability) return;

    let basePrice = travelPackage.pricing_tiers?.standard?.price || 0;
    basePrice *= selectedAvailability.price_multiplier || 1;
    
    let total = basePrice * bookingData.travelers.length;

    // Add extras
    bookingData.selectedExtras.forEach(selectedExtra => {
      const extra = extras.find(e => e.id === selectedExtra.extraId);
      if (extra) {
        const extraTotal = extra.per_person 
          ? extra.price * bookingData.travelers.length * selectedExtra.quantity
          : extra.price * selectedExtra.quantity;
        total += extraTotal;
      }
    });

    setBookingData(prev => ({ ...prev, totalAmount: total }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const selectedAvailability = availability.find(a => 
      new Date(a.available_date).toDateString() === date.toDateString()
    );

    if (!selectedAvailability) {
      toast.error(language === 'es' ? 'Fecha no disponible' : 'Date not available');
      return;
    }

    if (selectedAvailability.booked_count >= selectedAvailability.capacity) {
      toast.error(language === 'es' ? 'Fecha completa' : 'Date fully booked');
      return;
    }

    setBookingData(prev => ({ 
      ...prev, 
      selectedDate: date,
      availabilityId: selectedAvailability.id
    }));
  };

  const addTraveler = () => {
    setBookingData(prev => ({
      ...prev,
      travelers: [...prev.travelers, { name: '', age: 0 }]
    }));
  };

  const removeTraveler = (index: number) => {
    if (bookingData.travelers.length <= 1) return;
    setBookingData(prev => ({
      ...prev,
      travelers: prev.travelers.filter((_, i) => i !== index)
    }));
  };

  const updateTraveler = (index: number, field: 'name' | 'age', value: string | number) => {
    setBookingData(prev => ({
      ...prev,
      travelers: prev.travelers.map((traveler, i) => 
        i === index ? { ...traveler, [field]: value } : traveler
      )
    }));
  };

  const toggleExtra = (extraId: string) => {
    setBookingData(prev => {
      const existingIndex = prev.selectedExtras.findIndex(e => e.extraId === extraId);
      if (existingIndex >= 0) {
        return {
          ...prev,
          selectedExtras: prev.selectedExtras.filter((_, i) => i !== existingIndex)
        };
      } else {
        return {
          ...prev,
          selectedExtras: [...prev.selectedExtras, { extraId, quantity: 1 }]
        };
      }
    });
  };

  const updateExtraQuantity = (extraId: string, quantity: number) => {
    if (quantity < 1) return;
    setBookingData(prev => ({
      ...prev,
      selectedExtras: prev.selectedExtras.map(extra =>
        extra.extraId === extraId ? { ...extra, quantity } : extra
      )
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!bookingData.selectedDate;
      case 2:
        return bookingData.travelers.every(t => t.name.trim() && t.age > 0) &&
               bookingData.contactInfo.travelerName.trim() !== '' &&
               bookingData.contactInfo.travelerEmail.trim() !== '';
      case 3:
        return true; // Extras are optional
      case 4:
        return true; // Payment validation happens in payment flow
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast.error(language === 'es' ? 'Por favor completa todos los campos' : 'Please complete all fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const handlePayment = async (paymentMethod: 'stripe' | 'paypal') => {
    try {
      setSubmitting(true);

      const bookingPayload = {
        package_id: packageId,
        travel_start_date: bookingData.selectedDate?.toISOString().split('T')[0],
        travel_end_date: addDays(bookingData.selectedDate!, travelPackage!.duration).toISOString().split('T')[0],
        number_of_travelers: bookingData.travelers.length,
        total_amount: bookingData.totalAmount,
        traveler_name: bookingData.contactInfo.travelerName,
        traveler_email: bookingData.contactInfo.travelerEmail,
        traveler_whatsapp: bookingData.contactInfo.travelerWhatsapp,
        special_requests: bookingData.specialRequests,
        booking_data: {
          travelers: bookingData.travelers,
          selectedExtras: bookingData.selectedExtras,
          availabilityId: bookingData.availabilityId
        }
      };

      const { data, error } = await supabase.functions.invoke('create-travel-payment', {
        body: { 
          bookingData: bookingPayload,
          paymentMethod,
          language
        }
      });

      if (error) throw error;

      if (paymentMethod === 'stripe' && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (paymentMethod === 'paypal' && data.paypalUrl) {
        window.location.href = data.paypalUrl;
      }

    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error(language === 'es' ? 'Error al procesar pago' : 'Error processing payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-safe py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-2/3" />
            <Card>
              <CardContent className="p-8">
                <div className="h-64 bg-muted rounded" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!travelPackage) {
    return (
      <div className="container-safe py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            {language === 'es' ? 'Paquete no encontrado' : 'Package not found'}
          </h2>
          <Button onClick={() => navigate('/travel')}>
            {language === 'es' ? 'Volver a paquetes' : 'Back to packages'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-safe py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/travel')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Volver' : 'Back'}
          </Button>
          
          <div className="flex items-start gap-4">
            <img
              src={travelPackage.gallery?.images?.[0]?.url || '/placeholder.svg'}
              alt={travelPackage.title[language]}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                {travelPackage.title[language]}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {travelPackage.city}, {travelPackage.region}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {travelPackage.duration} {language === 'es' ? 'días' : 'days'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center flex-1">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2",
                  currentStep >= step.number 
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted bg-background"
                )}>
                  {currentStep > step.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{step.title}</div>
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step 1: Date Selection */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  {language === 'es' ? 'Selecciona tu fecha' : 'Select your date'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <Calendar
                      mode="single"
                      selected={bookingData.selectedDate || undefined}
                      onSelect={handleDateSelect}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today || !availability.some(a => 
                          new Date(a.available_date).toDateString() === date.toDateString()
                        );
                      }}
                      className="rounded-md border w-full"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">
                      {language === 'es' ? 'Fechas disponibles' : 'Available dates'}
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {availability.map((slot) => {
                        const date = new Date(slot.available_date);
                        const availableSpots = slot.capacity - slot.booked_count;
                        const isSelected = bookingData.selectedDate?.toDateString() === date.toDateString();
                        
                        return (
                          <div 
                            key={slot.id}
                            className={cn(
                              "p-3 rounded-lg border cursor-pointer transition-colors",
                              isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                              availableSpots === 0 && "opacity-50 cursor-not-allowed"
                            )}
                            onClick={() => availableSpots > 0 && handleDateSelect(date)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">
                                  {format(date, language === 'es' ? 'dd MMMM yyyy' : 'MMMM dd, yyyy')}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {availableSpots} {language === 'es' ? 'espacios disponibles' : 'spots available'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-primary">
                                  {formatPrice((travelPackage.pricing_tiers?.standard?.price || 0) * (slot.price_multiplier || 1))}
                                </div>
                                {slot.price_multiplier !== 1 && (
                                  <div className="text-xs text-accent">
                                    {slot.price_multiplier > 1 ? '+' : ''}{Math.round((slot.price_multiplier - 1) * 100)}%
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Traveler Information */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {language === 'es' ? 'Información de viajeros' : 'Traveler information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>{language === 'es' ? 'Nombre completo' : 'Full name'}</Label>
                    <Input
                      value={bookingData.contactInfo.travelerName}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, travelerName: e.target.value }
                      }))}
                      placeholder={language === 'es' ? 'Tu nombre completo' : 'Your full name'}
                    />
                  </div>
                  <div>
                    <Label>{language === 'es' ? 'Correo electrónico' : 'Email'}</Label>
                    <Input
                      type="email"
                      value={bookingData.contactInfo.travelerEmail}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, travelerEmail: e.target.value }
                      }))}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div>
                    <Label>{language === 'es' ? 'WhatsApp (opcional)' : 'WhatsApp (optional)'}</Label>
                    <Input
                      value={bookingData.contactInfo.travelerWhatsapp}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, travelerWhatsapp: e.target.value }
                      }))}
                      placeholder="+52 55 1234 5678"
                    />
                  </div>
                </div>

                <Separator />

                {/* Travelers */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">
                      {language === 'es' ? 'Viajeros' : 'Travelers'} ({bookingData.travelers.length})
                    </h3>
                    <Button onClick={addTraveler} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      {language === 'es' ? 'Agregar' : 'Add'}
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {bookingData.travelers.map((traveler, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">
                            {language === 'es' ? 'Viajero' : 'Traveler'} {index + 1}
                          </h4>
                          {bookingData.travelers.length > 1 && (
                            <Button
                              onClick={() => removeTraveler(index)}
                              variant="ghost"
                              size="sm"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>{language === 'es' ? 'Nombre completo' : 'Full name'}</Label>
                            <Input
                              value={traveler.name}
                              onChange={(e) => updateTraveler(index, 'name', e.target.value)}
                              placeholder={language === 'es' ? 'Nombre del viajero' : 'Traveler name'}
                            />
                          </div>
                          <div>
                            <Label>{language === 'es' ? 'Edad' : 'Age'}</Label>
                            <Input
                              type="number"
                              min="1"
                              max="100"
                              value={traveler.age || ''}
                              onChange={(e) => updateTraveler(index, 'age', parseInt(e.target.value) || 0)}
                              placeholder="25"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Extras */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  {language === 'es' ? 'Servicios adicionales' : 'Additional services'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {extras.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {language === 'es' ? 'No hay servicios adicionales disponibles' : 'No additional services available'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {extras.map((extra) => {
                      const selectedExtra = bookingData.selectedExtras.find(e => e.extraId === extra.id);
                      const isSelected = !!selectedExtra;
                      
                      return (
                        <div 
                          key={extra.id}
                          className={cn(
                            "p-4 border rounded-lg transition-colors",
                            isSelected ? "border-primary bg-primary/5" : "border-border"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleExtra(extra.id)}
                              />
                              <div className="flex-1">
                                <h4 className="font-medium mb-1">
                                  {extra.name[language]}
                                </h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {extra.description[language]}
                                </p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">{extra.category}</Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {extra.per_person 
                                      ? (language === 'es' ? 'Por persona' : 'Per person')
                                      : (language === 'es' ? 'Por grupo' : 'Per group')
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-bold text-primary mb-2">
                                {formatPrice(extra.price)}
                              </div>
                              
                              {isSelected && (
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateExtraQuantity(extra.id, selectedExtra.quantity - 1)}
                                    disabled={selectedExtra.quantity <= 1}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-8 text-center">{selectedExtra.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateExtraQuantity(extra.id, selectedExtra.quantity + 1)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Special Requests */}
                <div>
                  <Label>{language === 'es' ? 'Solicitudes especiales' : 'Special requests'}</Label>
                  <Textarea
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder={language === 'es' 
                      ? 'Cualquier solicitud especial o requerimiento dietético...'
                      : 'Any special requests or dietary requirements...'
                    }
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Payment */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {language === 'es' ? 'Confirmación y pago' : 'Confirmation and payment'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Booking Summary */}
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-4">
                    {language === 'es' ? 'Resumen de reserva' : 'Booking summary'}
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{language === 'es' ? 'Paquete:' : 'Package:'}</span>
                      <span>{travelPackage.title[language]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'es' ? 'Fecha:' : 'Date:'}</span>
                      <span>{bookingData.selectedDate && format(bookingData.selectedDate, 'PPP')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'es' ? 'Viajeros:' : 'Travelers:'}</span>
                      <span>{bookingData.travelers.length}</span>
                    </div>
                    
                    {bookingData.selectedExtras.length > 0 && (
                      <>
                        <Separator />
                        <div className="font-medium">
                          {language === 'es' ? 'Extras:' : 'Extras:'}
                        </div>
                        {bookingData.selectedExtras.map(selectedExtra => {
                          const extra = extras.find(e => e.id === selectedExtra.extraId);
                          if (!extra) return null;
                          
                          const extraTotal = extra.per_person 
                            ? extra.price * bookingData.travelers.length * selectedExtra.quantity
                            : extra.price * selectedExtra.quantity;
                          
                          return (
                            <div key={extra.id} className="flex justify-between text-xs">
                              <span>{extra.name[language]} x{selectedExtra.quantity}</span>
                              <span>{formatPrice(extraTotal)}</span>
                            </div>
                          );
                        })}
                      </>
                    )}
                    
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>{language === 'es' ? 'Total:' : 'Total:'}</span>
                      <span className="text-primary">{formatPrice(bookingData.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-accent" />
                    <span className="font-medium text-accent">
                      {language === 'es' ? 'Pago seguro' : 'Secure payment'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'es' 
                      ? 'Tus datos de pago están protegidos con encriptación de nivel bancario'
                      : 'Your payment information is protected with bank-level encryption'
                    }
                  </p>
                </div>

                {/* Payment Methods */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handlePayment('stripe')}
                    disabled={submitting}
                    className="h-16 text-lg"
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        {language === 'es' ? 'Pagar con tarjeta' : 'Pay with card'}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => handlePayment('paypal')}
                    disabled={submitting}
                    variant="outline"
                    className="h-16 text-lg"
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
                    ) : (
                      <>
                        <div className="w-5 h-5 mr-2 bg-[#0070ba] rounded" />
                        PayPal
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              onClick={prevStep}
              variant="outline"
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Anterior' : 'Previous'}
            </Button>
            
            {currentStep < 4 ? (
              <Button onClick={nextStep}>
                {language === 'es' ? 'Siguiente' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : null}
          </div>
        </div>

        {/* Price Summary Sidebar */}
        <div className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8">
          <Card className="w-80 shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {language === 'es' ? 'Total:' : 'Total:'}
                </span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(bookingData.totalAmount)}
                </span>
              </div>
              {bookingData.travelers.length > 0 && (
                <div className="text-sm text-muted-foreground mt-1">
                  {formatPrice(bookingData.totalAmount / bookingData.travelers.length)} {language === 'es' ? 'por persona' : 'per person'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};