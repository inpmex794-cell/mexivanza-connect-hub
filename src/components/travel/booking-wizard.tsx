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
import { CalendarIcon, Users, MapPin, Clock, Star, CreditCard, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

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
  package_id: string;
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
  travelers: Array<{ name: string; age: number }>;
  selectedExtras: Array<{ extraId: string; quantity: number }>;
  specialRequests: string;
  totalAmount: number;
}

interface BookingWizardProps {
  onBookingComplete?: (bookingId: string) => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({ onBookingComplete }) => {
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
    travelers: [{ name: '', age: 0 }],
    selectedExtras: [],
    specialRequests: '',
    totalAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const steps = [
    { number: 1, title: language === 'es' ? 'Fecha' : 'Date', description: language === 'es' ? 'Selecciona tu fecha' : 'Select your date' },
    { number: 2, title: language === 'es' ? 'Viajeros' : 'Travelers', description: language === 'es' ? 'Información de viajeros' : 'Traveler information' },
    { number: 3, title: language === 'es' ? 'Extras' : 'Extras', description: language === 'es' ? 'Servicios adicionales' : 'Additional services' },
    { number: 4, title: language === 'es' ? 'Pago' : 'Payment', description: language === 'es' ? 'Confirmar y pagar' : 'Confirm and pay' }
  ];

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchPackageData();
  }, [packageId, user]);

  useEffect(() => {
    calculateTotalPrice();
  }, [bookingData.travelers, bookingData.selectedExtras, bookingData.selectedDate]);

  const fetchPackageData = async () => {
    try {
      setLoading(true);
      
      // Fetch package details
      const { data: packageData } = await supabase
        .from('travel_packages')
        .select('*')
        .eq('id', packageId)
        .eq('is_published', true)
        .single();

      if (!packageData) {
        toast.error(language === 'es' ? 'Paquete no encontrado' : 'Package not found');
        navigate('/travel');
        return;
      }

      setTravelPackage(packageData);

      // For now, create mock availability data since tables may not exist yet
      const mockAvailability: AvailabilitySlot[] = [];
      const today = new Date();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        mockAvailability.push({
          id: `mock-${i}`,
          package_id: packageId!,
          available_date: date.toISOString().split('T')[0],
          capacity: 10,
          booked_count: Math.floor(Math.random() * 3),
          price_multiplier: 1.0
        });
      }

      setAvailability(mockAvailability);

      // Mock extras data
      const mockExtras: TravelExtra[] = [
        {
          id: 'extra-1',
          name: { es: 'Seguro de viaje', en: 'Travel insurance' },
          description: { es: 'Cobertura completa de viaje', en: 'Comprehensive travel coverage' },
          price: 500,
          per_person: true,
          category: 'Insurance',
          package_id: packageId!
        },
        {
          id: 'extra-2',
          name: { es: 'Traslado al aeropuerto', en: 'Airport transfer' },
          description: { es: 'Transporte desde/hacia el aeropuerto', en: 'Transportation to/from airport' },
          price: 800,
          per_person: false,
          category: 'Transport',
          package_id: packageId!
        }
      ];

      setExtras(mockExtras);

    } catch (error) {
      console.error('Error fetching package data:', error);
      toast.error(language === 'es' ? 'Error al cargar datos' : 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!travelPackage || !bookingData.selectedDate) return;

    let basePrice = 0;
    const pricingTiers = travelPackage.pricing_tiers;
    const travelerCount = bookingData.travelers.length;

    // Get base price from pricing tiers
    if (pricingTiers && pricingTiers[language]) {
      const tierData = pricingTiers[language];
      if (tierData.standard) {
        basePrice = tierData.standard.price * travelerCount;
      }
    }

    // Apply date multiplier
    const selectedAvailability = availability.find(a => 
      new Date(a.available_date).toDateString() === bookingData.selectedDate?.toDateString()
    );
    if (selectedAvailability) {
      basePrice *= selectedAvailability.price_multiplier;
    }

    // Add extras cost
    let extrasTotal = 0;
    bookingData.selectedExtras.forEach(selectedExtra => {
      const extra = extras.find(e => e.id === selectedExtra.extraId);
      if (extra) {
        const extraCost = extra.per_person 
          ? extra.price * travelerCount * selectedExtra.quantity
          : extra.price * selectedExtra.quantity;
        extrasTotal += extraCost;
      }
    });

    const totalAmount = basePrice + extrasTotal;
    setBookingData(prev => ({ ...prev, totalAmount }));
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const isDateAvailable = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const slot = availability.find(a => a.available_date === dateStr);
    return slot && slot.booked_count < slot.capacity;
  };

  const addTraveler = () => {
    setBookingData(prev => ({
      ...prev,
      travelers: [...prev.travelers, { name: '', age: 0 }]
    }));
  };

  const removeTraveler = (index: number) => {
    if (bookingData.travelers.length > 1) {
      setBookingData(prev => ({
        ...prev,
        travelers: prev.travelers.filter((_, i) => i !== index)
      }));
    }
  };

  const updateTraveler = (index: number, field: 'name' | 'age', value: string | number) => {
    setBookingData(prev => ({
      ...prev,
      travelers: prev.travelers.map((traveler, i) => 
        i === index ? { ...traveler, [field]: value } : traveler
      )
    }));
  };

  const toggleExtra = (extraId: string, quantity: number = 1) => {
    setBookingData(prev => {
      const existing = prev.selectedExtras.find(e => e.extraId === extraId);
      if (existing) {
        if (quantity === 0) {
          return {
            ...prev,
            selectedExtras: prev.selectedExtras.filter(e => e.extraId !== extraId)
          };
        } else {
          return {
            ...prev,
            selectedExtras: prev.selectedExtras.map(e => 
              e.extraId === extraId ? { ...e, quantity } : e
            )
          };
        }
      } else {
        return {
          ...prev,
          selectedExtras: [...prev.selectedExtras, { extraId, quantity }]
        };
      }
    });
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return bookingData.selectedDate !== null;
      case 2:
        return bookingData.travelers.every(t => t.name.trim() && t.age > 0);
      case 3:
        return true; // Optional step
      case 4:
        return true; // Final validation will be done on submit
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast.error(language === 'es' ? 'Por favor completa todos los campos requeridos' : 'Please complete all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user || !travelPackage || !bookingData.selectedDate) return;

    setSubmitting(true);
    try {
      // Create booking record
      const { data: booking, error } = await supabase
        .from('travel_bookings')
        .insert({
          user_id: user.id,
          package_id: packageId,
          travel_start_date: bookingData.selectedDate.toISOString().split('T')[0],
          travel_end_date: new Date(
            bookingData.selectedDate.getTime() + (travelPackage.duration - 1) * 24 * 60 * 60 * 1000
          ).toISOString().split('T')[0],
          number_of_travelers: bookingData.travelers.length,
          total_amount: bookingData.totalAmount,
          traveler_name: bookingData.travelers[0].name,
          traveler_email: user.email!,
          special_requests: bookingData.specialRequests,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Create Stripe checkout session
      const { data: session } = await supabase.functions.invoke('create-travel-payment', {
        body: {
          bookingId: booking.id,
          packageTitle: travelPackage.title[language] || travelPackage.title.es,
          amount: bookingData.totalAmount,
          currency: 'MXN',
          successUrl: `${window.location.origin}/travel/confirm/${booking.id}`,
          cancelUrl: `${window.location.origin}/travel/book/${packageId}`
        }
      });

      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('Failed to create payment session');
      }

    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error(language === 'es' ? 'Error al procesar la reserva' : 'Error processing booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">
            {language === 'es' ? 'Cargando...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!travelPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              {language === 'es' ? 'Paquete no encontrado' : 'Package not found'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/travel')} className="mt-4">
              {language === 'es' ? 'Volver a viajes' : 'Back to travel'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-display font-bold text-foreground">
              {language === 'es' ? 'Reservar viaje' : 'Book Trip'}
            </h1>
            <Button variant="outline" onClick={() => navigate('/travel')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Volver' : 'Back'}
            </Button>
          </div>
          
          <Progress value={(currentStep / 4) * 100} className="w-full h-2 mb-4" />
          
          <div className="flex justify-between">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex flex-col items-center ${
                  currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                    currentStep >= step.number
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.number}
                </div>
                <div className="text-xs text-center">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-muted-foreground">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'es' ? `Paso ${currentStep}` : `Step ${currentStep}`}: {steps[currentStep - 1].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Date Selection */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">
                        {language === 'es' ? 'Selecciona una fecha disponible' : 'Select an available date'}
                      </Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        {language === 'es' 
                          ? 'Las fechas en verde están disponibles para reserva'
                          : 'Dates in green are available for booking'
                        }
                      </p>
                    </div>
                    
                    <Calendar
                      mode="single"
                      selected={bookingData.selectedDate}
                      onSelect={(date) => setBookingData(prev => ({ ...prev, selectedDate: date || null }))}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today || !isDateAvailable(date);
                      }}
                      className="rounded-md border w-full"
                    />
                    
                    {bookingData.selectedDate && (
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className="w-4 h-4" />
                          <span className="font-medium">
                            {language === 'es' ? 'Fecha seleccionada:' : 'Selected date:'}
                          </span>
                          <span>
                            {bookingData.selectedDate.toLocaleDateString(
                              language === 'es' ? 'es-MX' : 'en-US',
                              { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Traveler Information */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">
                        {language === 'es' ? 'Información de viajeros' : 'Traveler information'}
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTraveler}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        {language === 'es' ? 'Agregar viajero' : 'Add traveler'}
                      </Button>
                    </div>

                    {bookingData.travelers.map((traveler, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">
                            {language === 'es' ? `Viajero ${index + 1}` : `Traveler ${index + 1}`}
                          </h4>
                          {bookingData.travelers.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeTraveler(index)}
                            >
                              {language === 'es' ? 'Eliminar' : 'Remove'}
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`name-${index}`}>
                              {language === 'es' ? 'Nombre completo' : 'Full name'} *
                            </Label>
                            <Input
                              id={`name-${index}`}
                              value={traveler.name}
                              onChange={(e) => updateTraveler(index, 'name', e.target.value)}
                              placeholder={language === 'es' ? 'Nombre completo' : 'Full name'}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`age-${index}`}>
                              {language === 'es' ? 'Edad' : 'Age'} *
                            </Label>
                            <Input
                              id={`age-${index}`}
                              type="number"
                              min="1"
                              max="120"
                              value={traveler.age || ''}
                              onChange={(e) => updateTraveler(index, 'age', parseInt(e.target.value) || 0)}
                              placeholder={language === 'es' ? 'Edad' : 'Age'}
                              required
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Step 3: Extras Selection */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <Label className="text-base font-medium">
                      {language === 'es' ? 'Servicios adicionales (opcional)' : 'Additional services (optional)'}
                    </Label>
                    
                    {extras.length === 0 ? (
                      <p className="text-muted-foreground">
                        {language === 'es' 
                          ? 'No hay servicios adicionales disponibles para este paquete'
                          : 'No additional services available for this package'
                        }
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {extras.map((extra) => {
                          const selectedExtra = bookingData.selectedExtras.find(e => e.extraId === extra.id);
                          const quantity = selectedExtra?.quantity || 0;
                          
                          return (
                            <Card key={extra.id} className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-medium">
                                      {extra.name[language] || extra.name.es}
                                    </h4>
                                    <Badge variant="secondary">
                                      {extra.category}
                                    </Badge>
                                    {extra.per_person && (
                                      <Badge variant="outline">
                                        {language === 'es' ? 'Por persona' : 'Per person'}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {extra.description[language] || extra.description.es}
                                  </p>
                                  <p className="font-medium text-primary">
                                    {formatPrice(extra.price)}
                                    {extra.per_person && ` × ${bookingData.travelers.length} ${language === 'es' ? 'personas' : 'people'}`}
                                  </p>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleExtra(extra.id, Math.max(0, quantity - 1))}
                                    disabled={quantity === 0}
                                  >
                                    -
                                  </Button>
                                  <span className="w-8 text-center">{quantity}</span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleExtra(extra.id, quantity + 1)}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    )}

                    <div>
                      <Label htmlFor="special-requests">
                        {language === 'es' ? 'Solicitudes especiales' : 'Special requests'}
                      </Label>
                      <Textarea
                        id="special-requests"
                        value={bookingData.specialRequests}
                        onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                        placeholder={language === 'es' 
                          ? 'Solicitudes especiales, alergias alimentarias, etc.'
                          : 'Special requests, food allergies, etc.'
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Payment */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">
                        {language === 'es' ? 'Resumen de la reserva' : 'Booking summary'}
                      </Label>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {travelPackage.title[language] || travelPackage.title.es}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {travelPackage.city}, {travelPackage.region}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {travelPackage.duration} {language === 'es' ? 'días' : 'days'}
                            </span>
                            <span className="text-sm flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {bookingData.travelers.length} {language === 'es' ? 'viajeros' : 'travelers'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{language === 'es' ? 'Fecha de viaje:' : 'Travel date:'}</span>
                          <span>
                            {bookingData.selectedDate?.toLocaleDateString(
                              language === 'es' ? 'es-MX' : 'en-US'
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{language === 'es' ? 'Viajeros:' : 'Travelers:'}</span>
                          <span>{bookingData.travelers.map(t => t.name).join(', ')}</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>{language === 'es' ? 'Subtotal del paquete:' : 'Package subtotal:'}</span>
                          <span>{formatPrice(bookingData.totalAmount)}</span>
                        </div>
                        
                        {bookingData.selectedExtras.length > 0 && (
                          <>
                            <div className="text-sm font-medium text-muted-foreground">
                              {language === 'es' ? 'Servicios adicionales:' : 'Additional services:'}
                            </div>
                            {bookingData.selectedExtras.map(selectedExtra => {
                              const extra = extras.find(e => e.id === selectedExtra.extraId);
                              if (!extra) return null;
                              
                              const cost = extra.per_person 
                                ? extra.price * bookingData.travelers.length * selectedExtra.quantity
                                : extra.price * selectedExtra.quantity;
                              
                              return (
                                <div key={extra.id} className="flex justify-between text-sm">
                                  <span>
                                    {extra.name[language] || extra.name.es} × {selectedExtra.quantity}
                                  </span>
                                  <span>{formatPrice(cost)}</span>
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>{language === 'es' ? 'Total:' : 'Total:'}</span>
                        <span className="text-primary">{formatPrice(bookingData.totalAmount)}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="font-medium">
                          {language === 'es' ? 'Métodos de pago' : 'Payment methods'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'es' 
                          ? 'Procesamiento seguro con Stripe. Aceptamos tarjetas de crédito, débito y PayPal.'
                          : 'Secure processing with Stripe. We accept credit cards, debit cards, and PayPal.'
                        }
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {language === 'es' ? 'Anterior' : 'Previous'}
                  </Button>

                  {currentStep < 4 ? (
                    <Button
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                    >
                      {language === 'es' ? 'Siguiente' : 'Next'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting || !validateStep(currentStep)}
                      className="bg-gradient-to-r from-primary to-primary-hover"
                    >
                      {submitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <CreditCard className="w-4 h-4 mr-2" />
                      )}
                      {submitting 
                        ? (language === 'es' ? 'Procesando...' : 'Processing...')
                        : (language === 'es' ? 'Proceder al pago' : 'Proceed to payment')
                      }
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Package Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'es' ? 'Resumen' : 'Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {travelPackage.gallery?.images?.[0] && (
                  <img
                    src={travelPackage.gallery.images[0]}
                    alt={travelPackage.title[language] || travelPackage.title.es}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
                
                <div>
                  <h3 className="font-medium text-sm">
                    {travelPackage.title[language] || travelPackage.title.es}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {travelPackage.city}, {travelPackage.region}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>{travelPackage.duration} {language === 'es' ? 'días' : 'days'}</span>
                  </div>
                  
                  {bookingData.selectedDate && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-3 h-3" />
                      <span>
                        {bookingData.selectedDate.toLocaleDateString(
                          language === 'es' ? 'es-MX' : 'en-US',
                          { month: 'short', day: 'numeric' }
                        )}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    <span>
                      {bookingData.travelers.length} {language === 'es' ? 'viajeros' : 'travelers'}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{language === 'es' ? 'Subtotal:' : 'Subtotal:'}</span>
                    <span>{formatPrice(bookingData.totalAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between font-medium text-primary">
                    <span>{language === 'es' ? 'Total:' : 'Total:'}</span>
                    <span>{formatPrice(bookingData.totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};