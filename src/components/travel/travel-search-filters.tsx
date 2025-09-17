import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, MapPin, DollarSign, Clock, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchFilters {
  destination: string;
  priceRange: [number, number];
  duration: string;
  tags: string[];
  dateRange: string;
}

interface TravelSearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

export const TravelSearchFilters: React.FC<TravelSearchFiltersProps> = ({
  onFiltersChange,
  className
}) => {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState<SearchFilters>({
    destination: searchParams.get('destination') || '',
    priceRange: [
      parseInt(searchParams.get('minPrice') || '0'),
      parseInt(searchParams.get('maxPrice') || '50000')
    ],
    duration: searchParams.get('duration') || '',
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
    dateRange: searchParams.get('dateRange') || ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Available filter options
  const destinations = [
    'Mexico City',
    'Cancún',
    'Puerto Vallarta',
    'Playa del Carmen',
    'Tulum',
    'Guadalajara',
    'Oaxaca',
    'San Miguel de Allende',
    'Mérida',
    'Cabo San Lucas'
  ];

  const durations = [
    { value: '1-3', label: language === 'es' ? '1-3 días' : '1-3 days' },
    { value: '4-7', label: language === 'es' ? '4-7 días' : '4-7 days' },
    { value: '8-14', label: language === 'es' ? '8-14 días' : '8-14 days' },
    { value: '15+', label: language === 'es' ? '15+ días' : '15+ days' }
  ];

  const popularTags = [
    'beach',
    'culture',
    'adventure',
    'luxury',
    'family',
    'romantic',
    'food',
    'historical',
    'nature',
    'wellness'
  ];

  const tagLabels = {
    beach: language === 'es' ? 'Playa' : 'Beach',
    culture: language === 'es' ? 'Cultura' : 'Culture',
    adventure: language === 'es' ? 'Aventura' : 'Adventure',
    luxury: language === 'es' ? 'Lujo' : 'Luxury',
    family: language === 'es' ? 'Familia' : 'Family',
    romantic: language === 'es' ? 'Romántico' : 'Romantic',
    food: language === 'es' ? 'Gastronomía' : 'Food',
    historical: language === 'es' ? 'Histórico' : 'Historical',
    nature: language === 'es' ? 'Naturaleza' : 'Nature',
    wellness: language === 'es' ? 'Bienestar' : 'Wellness'
  };

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    
    if (filters.destination && filters.destination !== 'all') params.set('destination', filters.destination);
    if (filters.priceRange[0] > 0) params.set('minPrice', filters.priceRange[0].toString());
    if (filters.priceRange[1] < 50000) params.set('maxPrice', filters.priceRange[1].toString());
    if (filters.duration && filters.duration !== 'all') params.set('duration', filters.duration);
    if (filters.tags.length > 0) params.set('tags', filters.tags.join(','));
    if (filters.dateRange && filters.dateRange !== 'all') params.set('dateRange', filters.dateRange);

    setSearchParams(params, { replace: true });
    onFiltersChange(filters);
  }, [filters, onFiltersChange, setSearchParams]);

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearFilters = () => {
    setFilters({
      destination: '',
      priceRange: [0, 50000],
      duration: 'all',
      tags: [],
      dateRange: 'all'
    });
  };

  const hasActiveFilters = (filters.destination && filters.destination !== 'all') || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 50000 ||
    (filters.duration && filters.duration !== 'all') ||
    filters.tags.length > 0 ||
    (filters.dateRange && filters.dateRange !== 'all');

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6 space-y-6">
        {/* Quick Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={language === 'es' ? 'Buscar destino...' : 'Search destination...'}
            value={filters.destination}
            onChange={(e) => updateFilter('destination', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Popular Destinations */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            {language === 'es' ? 'Destinos populares' : 'Popular destinations'}
          </Label>
          <div className="flex flex-wrap gap-2">
            {destinations.slice(0, 6).map((destination) => (
              <Badge
                key={destination}
                variant={filters.destination === destination ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => updateFilter('destination', 
                  filters.destination === destination ? '' : destination
                )}
              >
                <MapPin className="w-3 h-3 mr-1" />
                {destination}
              </Badge>
            ))}
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm"
          >
            <Filter className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Filtros avanzados' : 'Advanced filters'}
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-sm text-muted-foreground"
            >
              <X className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Limpiar' : 'Clear'}
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-6 pt-4 border-t">
            {/* Price Range */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <Label className="text-sm font-medium">
                  <DollarSign className="w-4 h-4 mr-1 inline" />
                  {language === 'es' ? 'Rango de precio' : 'Price range'}
                </Label>
                <span className="text-sm text-muted-foreground">
                  {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                </span>
              </div>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                max={50000}
                min={0}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{formatPrice(0)}</span>
                <span>{formatPrice(50000)}</span>
              </div>
            </div>

            {/* Duration */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                <Clock className="w-4 h-4 mr-1 inline" />
                {language === 'es' ? 'Duración' : 'Duration'}
              </Label>
              <Select value={filters.duration} onValueChange={(value) => updateFilter('duration', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'es' ? 'Cualquier duración' : 'Any duration'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'es' ? 'Cualquier duración' : 'Any duration'}</SelectItem>
                  {durations.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Experience Tags */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                {language === 'es' ? 'Tipo de experiencia' : 'Experience type'}
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {popularTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag}
                      checked={filters.tags.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    />
                    <Label
                      htmlFor={tag}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {tagLabels[tag as keyof typeof tagLabels]}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                {language === 'es' ? 'Cuándo viajar' : 'When to travel'}
              </Label>
              <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'es' ? 'Cualquier fecha' : 'Any time'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'es' ? 'Cualquier fecha' : 'Any time'}</SelectItem>
                  <SelectItem value="next-month">{language === 'es' ? 'Próximo mes' : 'Next month'}</SelectItem>
                  <SelectItem value="next-3-months">{language === 'es' ? 'Próximos 3 meses' : 'Next 3 months'}</SelectItem>
                  <SelectItem value="next-6-months">{language === 'es' ? 'Próximos 6 meses' : 'Next 6 months'}</SelectItem>
                  <SelectItem value="this-year">{language === 'es' ? 'Este año' : 'This year'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">
                {language === 'es' ? 'Filtros activos:' : 'Active filters:'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.destination && (
                <Badge variant="outline" className="gap-1">
                  {filters.destination}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => updateFilter('destination', '')}
                  />
                </Badge>
              )}
              {(filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) && (
                <Badge variant="outline" className="gap-1">
                  {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => updateFilter('priceRange', [0, 50000])}
                  />
                </Badge>
              )}
              {filters.duration && filters.duration !== 'all' && (
                <Badge variant="outline" className="gap-1">
                  {durations.find(d => d.value === filters.duration)?.label}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => updateFilter('duration', 'all')}
                  />
                </Badge>
              )}
              {filters.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="gap-1">
                  {tagLabels[tag as keyof typeof tagLabels]}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => toggleTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};