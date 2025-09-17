import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, Users, Clock, MapPin, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';

interface TravelPackage {
  id: string;
  title: any;
  description: any;
  base_price: number;
  currency: string;
  destination: string;
  duration: number;
  gallery?: any;
}

interface BookingData {
  travelerName: string;
  travelerEmail: string;
  travelerWhatsapp: string;
  startDate: Date | null;
  endDate: Date | null;
  numberOfTravelers: number;
  specialRequests: string;
}

const STEPS = [
  { id: 1, title: 'Fechas', description: 'Selecciona las fechas de tu viaje' },
  { id: 2, title: 'Viajeros', description: 'Información de contacto' },
  { id: 3, title: 'Confirmación', description: 'Revisa y confirma tu reserva' },
  { id: 4, title: 'Pago', description: 'Completa tu reserva' }
];

export function TravelBookingWizard() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  
  const [pkg, setPackage] = useState<TravelPackage | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [bookingData, setBookingData] = useState<BookingData>({
    travelerName: '',
    travelerEmail: user?.email || '',
    travelerWhatsapp: '',
    startDate: null,
    endDate: null,
    numberOfTravelers: 1,
    specialRequests: ''
  });

  useEffect(() => {
    if (packageId) {
      fetchPackage();
    }
  }, [packageId]);

  useEffect(() => {
    if (bookingData.startDate && pkg?.duration) {
      const endDate = new Date(bookingData.startDate);
      endDate.setDate(endDate.getDate() + pkg.duration - 1);
      setBookingData(prev => ({ ...prev, endDate }));
    }
  }, [bookingData.startDate, pkg?.duration]);

  const fetchPackage = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_packages')
        .select('*')
        .eq('id', packageId)
        .eq('is_published', true)
        .single();
      
      if (error) throw error;
      setPackage(data);
    } catch (error) {
      console.error('Error fetching package:', error);
      navigate('/travel/packages');
    } finally {
      setLoading(false);
    }
  };

  const getPackageTitle = (pkg: TravelPackage) => {
    if (typeof pkg.title === 'object' && pkg.title !== null) {
      return pkg.title[language] || pkg.title['es'] || 'Package';
    }
    return pkg.title || 'Package';
  };

  const calculateTotal = () => {
    if (!pkg) return 0;
    return pkg.base_price * bookingData.numberOfTravelers;
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return bookingData.startDate !== null;
      case 2:
        return bookingData.travelerName && 
               bookingData.travelerEmail && 
               bookingData.travelerWhatsapp &&
               bookingData.numberOfTravelers > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    } else {
      toast({
        title: "Información requerida",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleBookingSubmit = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc('create_booking', {
        p_package_id: packageId,
        p_traveler_name: bookingData.travelerName,
        p_traveler_email: bookingData.travelerEmail,
        p_traveler_whatsapp: bookingData.travelerWhatsapp,
        p_start_date: bookingData.startDate?.toISOString().split('T')[0],
        p_end_date: bookingData.endDate?.toISOString().split('T')[0]
      });

      if (error) throw error;

      toast({
        title: "¡Reserva creada!",
        description: "Tu reserva ha sido creada exitosamente. Te contactaremos pronto."
      });

      navigate(`/travel/booking-confirmation/${data[0].id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al crear tu reserva. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Cargando paquete...</p>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Paquete no encontrado</h1>
          <Button onClick={() => navigate('/travel/packages')}>
            Ver todos los paquetes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Package Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/travel/package/${packageId}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al paquete
          </Button>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img
                src={pkg.gallery?.images?.[0] || '/api/placeholder/400/300'}
                alt={getPackageTitle(pkg)}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="md:w-2/3">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                {getPackageTitle(pkg)}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {pkg.destination}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {pkg.duration} días
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-primary">
                    ${pkg.base_price?.toLocaleString()} {pkg.currency}
                  </span>
                  <span className="ml-1">por persona</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Steps Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Proceso de Reserva</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {STEPS.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-start space-x-3 ${
                      currentStep === step.id ? 'text-primary' :
                      currentStep > step.id ? 'text-green-600' : 'text-muted-foreground'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                      currentStep === step.id ? 'border-primary bg-primary text-white' :
                      currentStep > step.id ? 'border-green-600 bg-green-600 text-white' : 'border-muted-foreground'
                    }`}>
                      {currentStep > step.id ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <span className="text-xs font-medium">{step.id}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  Paso {currentStep}: {STEPS[currentStep - 1]?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Date Selection */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Fecha de inicio</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        El viaje durará {pkg.duration} días
                      </p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {bookingData.startDate ? (
                              format(bookingData.startDate, "PPP", { locale: es })
                            ) : (
                              "Selecciona fecha de inicio"
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={bookingData.startDate}
                            onSelect={(date) => setBookingData(prev => ({ ...prev, startDate: date }))}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {bookingData.startDate && bookingData.endDate && (
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Fechas seleccionadas:</h4>
                        <p className="text-sm">
                          <strong>Inicio:</strong> {format(bookingData.startDate, "PPP", { locale: es })}
                        </p>
                        <p className="text-sm">
                          <strong>Fin:</strong> {format(bookingData.endDate, "PPP", { locale: es })}
                        </p>
                        <p className="text-sm">
                          <strong>Duración:</strong> {pkg.duration} días
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Traveler Information */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="travelerName">Nombre completo *</Label>
                        <Input
                          id="travelerName"
                          value={bookingData.travelerName}
                          onChange={(e) => setBookingData(prev => ({ ...prev, travelerName: e.target.value }))}
                          placeholder="Tu nombre completo"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="numberOfTravelers">Número de viajeros *</Label>
                        <Input
                          id="numberOfTravelers"
                          type="number"
                          min="1"
                          max="10"
                          value={bookingData.numberOfTravelers}
                          onChange={(e) => setBookingData(prev => ({ ...prev, numberOfTravelers: parseInt(e.target.value) || 1 }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="travelerEmail">Email *</Label>
                        <Input
                          id="travelerEmail"
                          type="email"
                          value={bookingData.travelerEmail}
                          onChange={(e) => setBookingData(prev => ({ ...prev, travelerEmail: e.target.value }))}
                          placeholder="tu@email.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="travelerWhatsapp">WhatsApp *</Label>
                        <Input
                          id="travelerWhatsapp"
                          value={bookingData.travelerWhatsapp}
                          onChange={(e) => setBookingData(prev => ({ ...prev, travelerWhatsapp: e.target.value }))}
                          placeholder="+52 999 123 4567"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="specialRequests">Solicitudes especiales</Label>
                      <Textarea
                        id="specialRequests"
                        value={bookingData.specialRequests}
                        onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                        placeholder="Necesidades dietéticas, celebraciones especiales, etc."
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Resumen de tu reserva</h3>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Paquete:</strong>
                            <p>{getPackageTitle(pkg)}</p>
                          </div>
                          <div>
                            <strong>Destino:</strong>
                            <p>{pkg.destination}</p>
                          </div>
                          <div>
                            <strong>Fechas:</strong>
                            <p>
                              {bookingData.startDate && format(bookingData.startDate, "dd/MM/yyyy")} - {' '}
                              {bookingData.endDate && format(bookingData.endDate, "dd/MM/yyyy")}
                            </p>
                          </div>
                          <div>
                            <strong>Viajeros:</strong>
                            <p>{bookingData.numberOfTravelers} persona{bookingData.numberOfTravelers > 1 ? 's' : ''}</p>
                          </div>
                          <div>
                            <strong>Contacto:</strong>
                            <p>{bookingData.travelerName}</p>
                            <p>{bookingData.travelerEmail}</p>
                            <p>{bookingData.travelerWhatsapp}</p>
                          </div>
                          {bookingData.specialRequests && (
                            <div>
                              <strong>Solicitudes especiales:</strong>
                              <p>{bookingData.specialRequests}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total:</span>
                        <span className="text-primary">
                          ${calculateTotal().toLocaleString()} {pkg.currency}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        ${pkg.base_price?.toLocaleString()} × {bookingData.numberOfTravelers} viajero{bookingData.numberOfTravelers > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>

                  {currentStep < 3 ? (
                    <Button
                      onClick={handleNext}
                      disabled={!validateStep(currentStep)}
                    >
                      Siguiente
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleBookingSubmit}
                      disabled={submitting}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {submitting ? 'Procesando...' : 'Confirmar Reserva'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}