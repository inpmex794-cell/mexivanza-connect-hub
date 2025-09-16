import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Calendar,
  Plane,
  Camera,
  Coffee,
  Utensils,
  Bed,
  Wifi,
  Car,
  Shield,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TravelPackage {
  id: string;
  title: any;
  description: any;
  region: string | null;
  city: string | null;
  duration: number | null;
  pricing_tiers: any;
  gallery: any;
  itinerary: any;
  featured: boolean;
  scenario_tags: string[] | null;
}

export const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [package_, setPackage] = useState<TravelPackage | null>(null);
  const [relatedPackages, setRelatedPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPricing, setSelectedPricing] = useState<'standard' | 'premium'>('standard');

  useEffect(() => {
    if (id) {
      fetchPackageDetails();
      fetchRelatedPackages();
    }
  }, [id]);

  const fetchPackageDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_packages')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      setPackage(data as TravelPackage);
    } catch (error) {
      console.error('Error fetching package details:', error);
      toast.error(language === 'es' ? 'Error al cargar el paquete' : 'Error loading package');
      navigate('/travel/categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_packages')
        .select('*')
        .eq('is_published', true)
        .neq('id', id)
        .limit(3);

      if (error) throw error;
      setRelatedPackages((data || []) as TravelPackage[]);
    } catch (error) {
      console.error('Error fetching related packages:', error);
    }
  };

  const formatPrice = (price: number, currency: string = 'MXN') => {
    return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const handleBookNow = () => {
    const bookingData = {
      packageId: package_?.id,
      pricingTier: selectedPricing,
      price: package_?.pricing_tiers?.[selectedPricing]?.price || 0,
      currency: package_?.pricing_tiers?.[selectedPricing]?.currency || 'MXN'
    };
    
    // Store booking data in sessionStorage and navigate to booking flow
    sessionStorage.setItem('travelBookingData', JSON.stringify(bookingData));
    navigate('/travel/booking');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto p-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-96 bg-muted rounded" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-6 bg-muted rounded" />
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
              <div className="h-64 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!package_) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">
              {language === 'es' ? 'Paquete No Encontrado' : 'Package Not Found'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === 'es' 
                ? 'El paquete que buscas no existe o no está disponible'
                : 'The package you\'re looking for doesn\'t exist or is not available'
              }
            </p>
            <Button onClick={() => navigate('/travel/categories')}>
              {language === 'es' ? 'Ver Todos los Paquetes' : 'View All Packages'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const packageTitle = package_.title?.[language] || package_.title?.es || 'Travel Package';
  const packageDescription = package_.description?.[language] || package_.description?.es || '';
  const galleryImages = package_.gallery?.images || [];
  const itinerary = package_.itinerary || {};

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {language === 'es' ? 'Volver' : 'Back'}
        </Button>

        {/* Gallery Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-96">
            <div className="lg:col-span-3">
              <img
                src={galleryImages[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'}
                alt={packageTitle}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {galleryImages.slice(1, 3).map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`${packageTitle} ${index + 2}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">{package_.region}, {package_.city}</span>
                {package_.featured && (
                  <Badge className="bg-accent text-accent-foreground">
                    {language === 'es' ? 'Destacado' : 'Featured'}
                  </Badge>
                )}
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{packageTitle}</h1>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{package_.duration || 3} {language === 'es' ? 'días' : 'days'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{language === 'es' ? 'Hasta 8 personas' : 'Up to 8 people'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-warning" />
                  <span>4.8 (124 {language === 'es' ? 'reseñas' : 'reviews'})</span>
                </div>
              </div>
            </div>

            {/* Tabs Content */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">
                  {language === 'es' ? 'Resumen' : 'Overview'}
                </TabsTrigger>
                <TabsTrigger value="itinerary">
                  {language === 'es' ? 'Itinerario' : 'Itinerary'}
                </TabsTrigger>
                <TabsTrigger value="included">
                  {language === 'es' ? 'Incluido' : 'What\'s Included'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-foreground leading-relaxed text-lg">
                      {packageDescription}
                    </p>
                    
                    <div className="mt-6">
                      <h3 className="font-semibold text-xl mb-4">
                        {language === 'es' ? 'Destacados del Viaje' : 'Trip Highlights'}
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          language === 'es' ? 'Guía local experto' : 'Expert local guide',
                          language === 'es' ? 'Transporte incluido' : 'Transportation included',
                          language === 'es' ? 'Actividades exclusivas' : 'Exclusive activities',
                          language === 'es' ? 'Comidas gourmet' : 'Gourmet meals',
                          language === 'es' ? 'Alojamiento premium' : 'Premium accommodation',
                          language === 'es' ? 'Seguro de viaje' : 'Travel insurance'
                        ].map((item, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="itinerary" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {[1, 2, 3].map((day) => (
                        <div key={day} className="border-l-2 border-primary pl-6 relative">
                          <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full" />
                          <h4 className="font-semibold text-lg mb-2">
                            {language === 'es' ? `Día ${day}` : `Day ${day}`}
                          </h4>
                          <p className="text-muted-foreground mb-3">
                            {day === 1 && (language === 'es' ? 'Llegada y tour por la ciudad' : 'Arrival and city tour')}
                            {day === 2 && (language === 'es' ? 'Aventuras y actividades' : 'Adventures and activities')}
                            {day === 3 && (language === 'es' ? 'Relajación y partida' : 'Relaxation and departure')}
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline">
                              <Camera className="h-3 w-3 mr-1" />
                              {language === 'es' ? 'Fotos' : 'Photos'}
                            </Badge>
                            <Badge variant="outline">
                              <Utensils className="h-3 w-3 mr-1" />
                              {language === 'es' ? 'Comidas' : 'Meals'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="included" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-lg text-success mb-4">
                          {language === 'es' ? '✓ Incluido' : '✓ Included'}
                        </h4>
                        <ul className="space-y-3">
                          {[
                            { icon: Bed, text: language === 'es' ? 'Alojamiento premium' : 'Premium accommodation' },
                            { icon: Car, text: language === 'es' ? 'Transporte privado' : 'Private transportation' },
                            { icon: Utensils, text: language === 'es' ? 'Todas las comidas' : 'All meals included' },
                            { icon: Shield, text: language === 'es' ? 'Seguro de viaje' : 'Travel insurance' },
                            { icon: Wifi, text: language === 'es' ? 'WiFi gratuito' : 'Free WiFi' }
                          ].map((item, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <item.icon className="h-5 w-5 text-success" />
                              <span>{item.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-lg text-destructive mb-4">
                          {language === 'es' ? '✗ No Incluido' : '✗ Not Included'}
                        </h4>
                        <ul className="space-y-3">
                          {[
                            language === 'es' ? 'Vuelos internacionales' : 'International flights',
                            language === 'es' ? 'Gastos personales' : 'Personal expenses',
                            language === 'es' ? 'Propinas' : 'Tips',
                            language === 'es' ? 'Actividades opcionales' : 'Optional activities'
                          ].map((item, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <div className="w-5 h-5 flex items-center justify-center">
                                <div className="w-3 h-3 border border-destructive rounded-full" />
                              </div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>
                  {language === 'es' ? 'Reservar Ahora' : 'Book Now'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pricing Options */}
                <div className="space-y-3">
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPricing === 'standard' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => setSelectedPricing('standard')}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">
                          {language === 'es' ? 'Estándar' : 'Standard'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {language === 'es' ? 'Todo incluido' : 'All inclusive'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {formatPrice(package_.pricing_tiers?.standard?.price || 2500)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {language === 'es' ? 'por persona' : 'per person'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {package_.pricing_tiers?.premium && (
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPricing === 'premium' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => setSelectedPricing('premium')}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">
                            {language === 'es' ? 'Premium' : 'Premium'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {language === 'es' ? 'Lujo total' : 'Ultimate luxury'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            {formatPrice(package_.pricing_tiers.premium.price)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {language === 'es' ? 'por persona' : 'per person'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button className="w-full" size="lg" onClick={handleBookNow}>
                  {language === 'es' ? 'Reservar Ahora' : 'Book Now'}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  {language === 'es' ? 'Cancelación gratuita hasta 24h antes' : 'Free cancellation up to 24h before'}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Packages */}
        {relatedPackages.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-8">
              {language === 'es' ? 'Paquetes Relacionados' : 'Related Packages'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPackages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={pkg.gallery?.images?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'} 
                      alt={pkg.title?.[language] || 'Travel Package'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {pkg.title?.[language] || pkg.title?.es || 'Travel Package'}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{pkg.duration || 3} {language === 'es' ? 'días' : 'days'}</span>
                      </div>
                      <div className="font-semibold text-primary">
                        {formatPrice(pkg.pricing_tiers?.standard?.price || 2500)}
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-3" 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/travel/package/${pkg.id}`)}
                    >
                      {language === 'es' ? 'Ver Detalles' : 'View Details'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};