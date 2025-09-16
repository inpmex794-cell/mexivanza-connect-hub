import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Search, Users, MapPin, Star, Clock, Shield, Heart, Globe, Plane, Award, CheckCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import heroImage from '@/assets/hero-mexico.jpg';

interface TravelPackage {
  id: string;
  title: any;
  description: any;
  region: string | null;
  city: string | null;
  duration: number | null;
  pricing_tiers: any;
  gallery: any;
  featured: boolean;
  scenario_tags: string[] | null;
}

export const TravelHomepage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [featuredPackages, setFeaturedPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search form state
  const [searchForm, setSearchForm] = useState({
    destination: '',
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
    travelers: 2
  });

  // Fetch featured packages
  useEffect(() => {
    fetchFeaturedPackages();
  }, []);

  const fetchFeaturedPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_packages')
        .select('*')
        .eq('is_published', true)
        .eq('featured', true)
        .limit(6);

      if (error) throw error;
      setFeaturedPackages((data || []) as TravelPackage[]);
    } catch (error) {
      console.error('Error fetching featured packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (searchForm.destination) searchParams.set('destination', searchForm.destination);
    if (searchForm.checkIn) searchParams.set('checkIn', searchForm.checkIn.toISOString());
    if (searchForm.checkOut) searchParams.set('checkOut', searchForm.checkOut.toISOString());
    searchParams.set('travelers', searchForm.travelers.toString());
    
    navigate(`/travel/categories?${searchParams.toString()}`);
  };

  const formatPrice = (price: number, currency: string = 'MXN') => {
    return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const whyTravelWithUs = [
    {
      icon: Shield,
      title: language === 'es' ? 'Viajes Seguros' : 'Safe Travel',
      description: language === 'es' 
        ? 'Protección completa y asistencia 24/7 durante tu viaje'
        : 'Complete protection and 24/7 assistance during your trip',
      color: 'text-primary'
    },
    {
      icon: Award,
      title: language === 'es' ? 'Experiencias Premium' : 'Premium Experiences',
      description: language === 'es'
        ? 'Destinos exclusivos y servicios de primera clase'
        : 'Exclusive destinations and first-class services',
      color: 'text-accent'
    },
    {
      icon: Heart,
      title: language === 'es' ? 'Atención Personalizada' : 'Personalized Care',
      description: language === 'es'
        ? 'Cada viaje diseñado especialmente para ti'
        : 'Every trip specially designed for you',
      color: 'text-success'
    },
    {
      icon: Globe,
      title: language === 'es' ? 'Conocimiento Local' : 'Local Knowledge',
      description: language === 'es'
        ? 'Guías locales expertos en cada destino'
        : 'Expert local guides at every destination',
      color: 'text-primary'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Search */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-accent/30" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            {language === 'es' ? 'Descubre México' : 'Discover Mexico'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            {language === 'es' 
              ? 'Experiencias inolvidables en los destinos más hermosos de México'
              : 'Unforgettable experiences in Mexico\'s most beautiful destinations'
            }
          </p>

          {/* Search Form */}
          <Card className="max-w-4xl mx-auto mt-8 bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {language === 'es' ? 'Destino' : 'Destination'}
                  </label>
                  <Select value={searchForm.destination} onValueChange={(value) => setSearchForm(prev => ({ ...prev, destination: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'es' ? '¿A dónde vamos?' : 'Where to?'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cancun">Cancún</SelectItem>
                      <SelectItem value="riviera-maya">Riviera Maya</SelectItem>
                      <SelectItem value="playa-del-carmen">Playa del Carmen</SelectItem>
                      <SelectItem value="tulum">Tulum</SelectItem>
                      <SelectItem value="cozumel">Cozumel</SelectItem>
                      <SelectItem value="cabo">Los Cabos</SelectItem>
                      <SelectItem value="puerto-vallarta">Puerto Vallarta</SelectItem>
                      <SelectItem value="mazatlan">Mazatlán</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {language === 'es' ? 'Fecha de entrada' : 'Check-in'}
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !searchForm.checkIn && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchForm.checkIn ? format(searchForm.checkIn, "PPP", { locale: language === 'es' ? es : enUS }) : 
                         <span>{language === 'es' ? 'Fecha' : 'Pick date'}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={searchForm.checkIn}
                        onSelect={(date) => setSearchForm(prev => ({ ...prev, checkIn: date }))}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {language === 'es' ? 'Fecha de salida' : 'Check-out'}
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !searchForm.checkOut && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchForm.checkOut ? format(searchForm.checkOut, "PPP", { locale: language === 'es' ? es : enUS }) : 
                         <span>{language === 'es' ? 'Fecha' : 'Pick date'}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={searchForm.checkOut}
                        onSelect={(date) => setSearchForm(prev => ({ ...prev, checkOut: date }))}
                        disabled={(date) => date < (searchForm.checkIn || new Date())}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {language === 'es' ? 'Viajeros' : 'Travelers'}
                  </label>
                  <Select value={searchForm.travelers.toString()} onValueChange={(value) => setSearchForm(prev => ({ ...prev, travelers: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {language === 'es' ? (num === 1 ? 'viajero' : 'viajeros') : (num === 1 ? 'traveler' : 'travelers')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={handleSearch}
                className="w-full mt-6 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-3"
                size="lg"
              >
                <Search className="mr-2 h-5 w-5" />
                {language === 'es' ? 'Buscar Viajes' : 'Search Trips'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'es' ? 'Paquetes Destacados' : 'Featured Packages'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === 'es' 
                ? 'Descubre nuestras experiencias más populares diseñadas para crear recuerdos inolvidables'
                : 'Discover our most popular experiences designed to create unforgettable memories'
              }
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="h-48 bg-muted" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded mb-4" />
                    <div className="h-6 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPackages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={pkg.gallery?.images?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'} 
                      alt={pkg.title?.[language] || 'Travel Package'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                      {language === 'es' ? 'Destacado' : 'Featured'}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{pkg.region}, {pkg.city}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {pkg.title?.[language] || pkg.title?.es || 'Travel Package'}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {pkg.description?.[language] || pkg.description?.es || 'Discover amazing destinations'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{pkg.duration || 3} {language === 'es' ? 'días' : 'days'}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">{language === 'es' ? 'Desde' : 'From'}</div>
                        <div className="font-semibold text-lg text-primary">
                          {formatPrice(pkg.pricing_tiers?.standard?.price || 2500, pkg.pricing_tiers?.standard?.currency || 'MXN')}
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4" asChild>
                      <Link to={`/travel/package/${pkg.id}`}>
                        {language === 'es' ? 'Ver Detalles' : 'View Details'}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/travel/categories">
                {language === 'es' ? 'Ver Todos los Paquetes' : 'View All Packages'}
                <Plane className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Travel With Us */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'es' ? '¿Por Qué Viajar Con Nosotros?' : 'Why Travel With Us?'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === 'es' 
                ? 'Más de 10 años creando experiencias inolvidables en México'
                : 'Over 10 years creating unforgettable experiences in Mexico'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyTravelWithUs.map((feature, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-md transition-shadow group">
                <CardContent className="p-0">
                  <div className={cn("w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform", 
                    feature.color === 'text-accent' && "bg-accent/10",
                    feature.color === 'text-success' && "bg-success/10"
                  )}>
                    <feature.icon className={cn("h-8 w-8", feature.color)} />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">{language === 'es' ? 'Viajeros Felices' : 'Happy Travelers'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">{language === 'es' ? 'Destinos' : 'Destinations'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">{language === 'es' ? 'Soporte' : 'Support'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">{language === 'es' ? 'Satisfacción' : 'Satisfaction'}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};