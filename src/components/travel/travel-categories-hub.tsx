import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plane, Hotel, Shield, Ship, Home, MapPin as Guide, 
  Bus, Car, Star, MapPin, Clock, Users, Filter, Search 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { CategoryBookingModal } from './category-booking-modal';

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

export const TravelCategoriesHub: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [listings, setListings] = useState<TravelListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<TravelListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedListing, setSelectedListing] = useState<TravelListing | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<'all' | 'budget' | 'mid' | 'luxury'>('all');

  const categories = [
    { id: 'all', name: { es: 'Todos', en: 'All' }, icon: Star },
    { id: 'flights', name: { es: 'Vuelos', en: 'Flights' }, icon: Plane },
    { id: 'hotels', name: { es: 'Hoteles', en: 'Hotels' }, icon: Hotel },
    { id: 'insurance', name: { es: 'Seguros', en: 'Insurance' }, icon: Shield },
    { id: 'cruises', name: { es: 'Cruceros', en: 'Cruises' }, icon: Ship },
    { id: 'airbnb', name: { es: 'Airbnb', en: 'Airbnb' }, icon: Home },
    { id: 'tour_guides', name: { es: 'Guías', en: 'Tour Guides' }, icon: Guide },
    { id: 'charters', name: { es: 'Charters', en: 'Charters' }, icon: Bus },
    { id: 'car_rentals', name: { es: 'Autos', en: 'Car Rentals' }, icon: Car },
  ];

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [listings, selectedCategory, searchTerm, priceRange]);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_bookings_categories')
        .select('*')
        .eq('is_published', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings((data as any) || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast({
        title: t('error.general', 'Error'),
        description: t('travel.fetch_error', 'Failed to load travel listings'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = listings;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(listing => listing.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(listing => 
        listing.title[language]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description[language]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.provider_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    if (priceRange !== 'all') {
      filtered = filtered.filter(listing => {
        const price = listing.price_amount;
        switch (priceRange) {
          case 'budget': return price <= 2000;
          case 'mid': return price > 2000 && price <= 10000;
          case 'luxury': return price > 10000;
          default: return true;
        }
      });
    }

    setFilteredListings(filtered);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: currency === 'MXN' ? 'MXN' : 'USD',
    }).format(price);
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || Star;
  };

  const handleBookNow = (listing: TravelListing) => {
    setSelectedListing(listing);
    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <Card key={i} className="h-80 animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-4 w-3/4"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {t('travel.categories_title', 'Travel Services')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('travel.categories_subtitle', 'Complete travel solutions for your perfect trip to Mexico')}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 p-4 bg-muted/30 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('travel.search_placeholder', 'Search destinations, providers, services...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={priceRange} onValueChange={(value: any) => setPriceRange(value)}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder={t('travel.price_range', 'Price Range')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('travel.all_prices', 'All Prices')}</SelectItem>
            <SelectItem value="budget">{t('travel.budget', 'Budget (≤$2,000)')}</SelectItem>
            <SelectItem value="mid">{t('travel.mid_range', 'Mid Range ($2,000-$10,000)')}</SelectItem>
            <SelectItem value="luxury">{t('travel.luxury', 'Luxury (>$10,000)')}</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          onClick={() => {
            setSearchTerm('');
            setPriceRange('all');
            setSelectedCategory('all');
          }}
        >
          <Filter className="w-4 h-4 mr-2" />
          {t('travel.clear_filters', 'Clear')}
        </Button>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex flex-col items-center gap-1 h-16 lg:h-auto lg:flex-row lg:gap-2"
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs lg:text-sm">{category.name[language]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((listing) => {
            const Icon = getCategoryIcon(listing.category);
            return (
              <Card key={listing.id} className={`group hover:shadow-lg transition-all duration-300 ${listing.featured ? 'ring-2 ring-primary' : ''}`}>
                {listing.featured && (
                  <div className="absolute -top-2 left-4 z-10">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      {t('travel.featured', 'Featured')}
                    </Badge>
                  </div>
                )}
                
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={listing.gallery?.images?.[0]?.url || '/placeholder.svg'}
                    alt={listing.gallery?.images?.[0]?.caption?.[language] || listing.title[language]}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full p-2">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {listing.title[language]}
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="line-clamp-1">{listing.location}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {listing.provider_name}
                      </div>
                    </div>
                  </div>
                  
                  <CardDescription className="line-clamp-2">
                    {listing.description[language]}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {listing.scenario_tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      {listing.reviews?.rating > 0 && (
                        <div className="flex items-center text-sm">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{listing.reviews.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground ml-1">
                            ({listing.reviews.count})
                          </span>
                        </div>
                      )}
                      {listing.availability > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {listing.availability} {t('travel.available', 'available')}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">
                      {getCategoryPriceLabel(listing.category, language)}
                    </span>
                    <span className="font-bold text-lg text-primary">
                      {formatPrice(listing.price_amount, listing.price_currency)}
                    </span>
                  </div>

                  <Button 
                    onClick={() => handleBookNow(listing)} 
                    className="w-full"
                    disabled={listing.availability === 0}
                  >
                    {listing.availability === 0 
                      ? t('travel.sold_out', 'Sold Out')
                      : t('travel.book_now', 'Book Now')
                    }
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredListings.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">
              {t('travel.no_results', 'No results found')}
            </h3>
            <p className="text-muted-foreground">
              {t('travel.try_different_filters', 'Try adjusting your filters or search terms')}
            </p>
          </div>
        )}
      </Tabs>

      {/* Booking Modal */}
      {selectedListing && (
        <CategoryBookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedListing(null);
          }}
          listing={selectedListing}
        />
      )}
    </div>
  );
};

// Helper function to get category-specific price labels
const getCategoryPriceLabel = (category: string, language: string): string => {
  const labels = {
    flights: { es: 'Por persona', en: 'Per person' },
    hotels: { es: 'Por noche', en: 'Per night' },
    insurance: { es: 'Por viaje', en: 'Per trip' },
    cruises: { es: 'Por persona', en: 'Per person' },
    airbnb: { es: 'Por noche', en: 'Per night' },
    tour_guides: { es: 'Por hora', en: 'Per hour' },
    charters: { es: 'Por hora', en: 'Per hour' },
    car_rentals: { es: 'Por día', en: 'Per day' },
  };
  
  return labels[category as keyof typeof labels]?.[language as 'es' | 'en'] || 
         (language === 'es' ? 'Desde' : 'From');
};