import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, MapPin, Star, Filter, X } from 'lucide-react';
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
  gallery?: any;
  rating: number;
}

export function TravelPackages() {
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    search: searchParams.get('destination') || '',
    priceRange: [0, 5000],
    duration: '',
    tags: [] as string[],
    destination: ''
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [packages, filters]);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_packages')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...packages];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(pkg => {
        const title = getPackageTitle(pkg).toLowerCase();
        const description = getPackageDescription(pkg).toLowerCase();
        const destination = pkg.destination?.toLowerCase() || '';
        const search = filters.search.toLowerCase();
        
        return title.includes(search) || 
               description.includes(search) || 
               destination.includes(search);
      });
    }

    // Price filter
    filtered = filtered.filter(pkg => 
      pkg.base_price >= filters.priceRange[0] && 
      pkg.base_price <= filters.priceRange[1]
    );

    // Duration filter
    if (filters.duration && filters.duration !== 'all') {
      const [min, max] = filters.duration.split('-').map(Number);
      filtered = filtered.filter(pkg => {
        if (max) {
          return pkg.duration >= min && pkg.duration <= max;
        }
        return pkg.duration >= min;
      });
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(pkg =>
        filters.tags.some(tag => pkg.tags?.includes(tag))
      );
    }

    // Destination filter
    if (filters.destination && filters.destination !== 'all') {
      filtered = filtered.filter(pkg =>
        pkg.destination?.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }

    setFilteredPackages(filtered);
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

  const clearFilters = () => {
    setFilters({
      search: '',
      priceRange: [0, 5000],
      duration: '',
      tags: [],
      destination: ''
    });
  };

  const availableTags = [...new Set(packages.flatMap(pkg => pkg.tags || []))];
  const availableDestinations = [...new Set(packages.map(pkg => pkg.destination).filter(Boolean))];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            {t('travelPackages', 'Paquetes de Viaje')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('packagesSubtitle', 'Descubre nuestras experiencias únicas en México')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">{t('filters', 'Filtros')}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('search', 'Buscar')}
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t('searchPlaceholder', 'Buscar paquetes...')}
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('priceRange', 'Rango de Precio')}
                    </label>
                    <div className="px-2">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                        max={5000}
                        min={0}
                        step={100}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${filters.priceRange[0]}</span>
                        <span>${filters.priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('duration', 'Duración')}
                    </label>
                    <Select value={filters.duration} onValueChange={(value) => setFilters(prev => ({ ...prev, duration: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectDuration', 'Seleccionar duración')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las duraciones</SelectItem>
                        <SelectItem value="1-3">1-3 días</SelectItem>
                        <SelectItem value="4-7">4-7 días</SelectItem>
                        <SelectItem value="8-14">8-14 días</SelectItem>
                        <SelectItem value="15">15+ días</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Destination */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('destination', 'Destino')}
                    </label>
                    <Select value={filters.destination} onValueChange={(value) => setFilters(prev => ({ ...prev, destination: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectDestination', 'Seleccionar destino')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los destinos</SelectItem>
                        {availableDestinations.map(destination => (
                          <SelectItem key={destination} value={destination}>
                            {destination}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('categories', 'Categorías')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.slice(0, 8).map(tag => (
                        <Badge
                          key={tag}
                          variant={filters.tags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            setFilters(prev => ({
                              ...prev,
                              tags: prev.tags.includes(tag)
                                ? prev.tags.filter(t => t !== tag)
                                : [...prev.tags, tag]
                            }));
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {t('clearFilters', 'Limpiar Filtros')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Packages Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-muted-foreground">
                {t('showingResults', 'Mostrando')} {filteredPackages.length} {t('packages', 'paquetes')}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            ) : filteredPackages.length === 0 ? (
              <Card className="p-12 text-center">
                <h3 className="text-lg font-semibold mb-2">
                  {t('noPackagesFound', 'No se encontraron paquetes')}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t('tryDifferentFilters', 'Intenta con diferentes filtros')}
                </p>
                <Button onClick={clearFilters}>
                  {t('clearFilters', 'Limpiar Filtros')}
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPackages.map((pkg) => (
                  <Card key={pkg.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={pkg.gallery?.images?.[0] || `/api/placeholder/400/300`}
                        alt={getPackageTitle(pkg)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
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
          </div>
        </div>
      </div>
    </div>
  );
}