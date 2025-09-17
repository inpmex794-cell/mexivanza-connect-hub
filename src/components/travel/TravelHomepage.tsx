import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, Users, Star, Plane, Heart, Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/use-language';

interface TravelPackage {
  id: string;
  title: any;
  description: any;
  base_price: number;
  currency: string;
  destination: string;
  duration: number;
  tags: string[];
  is_featured: boolean;
  gallery?: any;
  rating: number;
}

export function TravelHomepage() {
  const { language, t } = useLanguage();
  const [featuredPackages, setFeaturedPackages] = useState<TravelPackage[]>([]);
  const [searchParams, setSearchParams] = useState({
    destination: '',
    travelers: '2',
    startDate: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPackages();
  }, []);

  const fetchFeaturedPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_packages')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .limit(6);
      
      if (error) throw error;
      setFeaturedPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const searchQuery = new URLSearchParams({
      destination: searchParams.destination,
      travelers: searchParams.travelers,
      startDate: searchParams.startDate
    }).toString();
    
    window.location.href = `/travel/packages?${searchQuery}`;
  };

  const getPackageTitle = (pkg: TravelPackage) => {
    if (typeof pkg.title === 'object' && pkg.title !== null) {
      return pkg.title[language] || pkg.title['es'] || 'Package';
    }
    return pkg.title || 'Package';
  };

  const getPackageDescription = (pkg: TravelPackage) => {
    if (typeof pkg.description === 'object' && pkg.description !== null) {
      return pkg.description[language] || pkg.description['es'] || '';
    }
    return pkg.description || '';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Travel Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="flex h-full items-center justify-between px-4 container mx-auto">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex-shrink-0"></div>
            <span className="text-lg font-bold text-foreground">Mexivanza</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/travel" className="text-foreground hover:text-primary">
              {t('home', 'Inicio')}
            </Link>
            <Link to="/travel/packages" className="text-foreground hover:text-primary">
              {t('packages', 'Paquetes')}
            </Link>
            <Link to="/travel/categories" className="text-foreground hover:text-primary">
              {t('categories', 'Categorías')}
            </Link>
          </nav>
          
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="outline" size="sm">
                {t('login', 'Iniciar Sesión')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary/10 text-white pt-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              {t('heroTitle', 'Descubre México Auténtico')}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-12">
              {t('heroSubtitle', 'Experiencias únicas que conectan con la verdadera esencia mexicana')}
            </p>
            
            {/* Search Form */}
            <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('searchDestination', 'Destino')}
                      value={searchParams.destination}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, destination: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={searchParams.startDate}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, startDate: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      placeholder={t('travelers', 'Viajeros')}
                      value={searchParams.travelers}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, travelers: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    onClick={handleSearch}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {t('search', 'Buscar')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              {t('featuredExperiences', 'Experiencias Destacadas')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('featuredSubtitle', 'Descubre nuestras experiencias más populares y mejor valoradas')}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="h-96 animate-pulse">
                  <div className="bg-muted h-48 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="bg-muted h-4 rounded mb-2"></div>
                    <div className="bg-muted h-3 rounded mb-4"></div>
                    <div className="bg-muted h-6 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPackages.map((pkg) => (
                <Card key={pkg.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pkg.gallery?.images?.[0] || `/api/placeholder/400/300`}
                      alt={getPackageTitle(pkg)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/90 text-primary">
                        {t('featured', 'Destacado')}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center bg-white/90 px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-xs font-medium">{pkg.rating || 4.8}</span>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {pkg.tags?.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {getPackageTitle(pkg)}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {getPackageDescription(pkg)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{pkg.destination}</span>
                        <span className="mx-2">•</span>
                        <span>{pkg.duration} {t('days', 'días')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          ${pkg.base_price?.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground ml-1">
                          {pkg.currency}
                        </span>
                      </div>
                      <Link to={`/travel/package/${pkg.id}`}>
                        <Button className="bg-primary hover:bg-primary/90">
                          {t('viewDetails', 'Ver Detalles')}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/travel/packages">
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
                {t('viewAllPackages', 'Ver Todos los Paquetes')}
                <Plane className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Travel With Us */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              {t('whyChooseUs', '¿Por Qué Elegir Mexivanza?')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('whyChooseSubtitle', 'Más de 10 años creando experiencias auténticas en México')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-4">
                {t('authentic', 'Experiencias Auténticas')}
              </h3>
              <p className="text-muted-foreground">
                {t('authenticDesc', 'Conectamos con la verdadera esencia mexicana, más allá del turismo tradicional')}
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-4">
                {t('safety', 'Seguridad Garantizada')}
              </h3>
              <p className="text-muted-foreground">
                {t('safetyDesc', 'Todos nuestros tours cuentan con seguros y guías certificados para tu tranquilidad')}
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-4">
                {t('support', 'Soporte 24/7')}
              </h3>
              <p className="text-muted-foreground">
                {t('supportDesc', 'Nuestro equipo está disponible para ayudarte antes, durante y después de tu viaje')}
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}