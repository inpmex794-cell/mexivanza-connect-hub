import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, MapPin, Users, Star, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { TravelBookingModal } from './travel-booking-modal';

interface TravelPackage {
  id: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  region: string;
  city: string;
  scenario_tags: string[];
  duration: number;
  pricing_tiers: {
    standard: { price: number; currency: string; includes: string[] };
    premium: { price: number; currency: string; includes: string[] };
  };
  itinerary: {
    days: Array<{
      day: number;
      title: { es: string; en: string };
      activities: { es: string; en: string };
    }>;
  };
  gallery: {
    images: Array<{
      url: string;
      caption: { es: string; en: string };
    }>;
  };
  availability: number;
  featured: boolean;
  is_published: boolean;
  is_demo: boolean;
}

export const TravelPackages: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_packages')
        .select('*')
        .eq('is_published', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages((data as any) || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: t('error.general', 'Error'),
        description: t('travel.fetch_error', 'Failed to load travel packages'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (pkg: TravelPackage) => {
    setSelectedPackage(pkg);
    setShowBookingModal(true);
  };

  const toggleFavorite = (packageId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(packageId)) {
      newFavorites.delete(packageId);
    } else {
      newFavorites.add(packageId);
    }
    setFavorites(newFavorites);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: currency === 'MXN' ? 'MXN' : 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-96 animate-pulse">
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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {t('travel.packages_title', 'Travel Packages')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('travel.packages_subtitle', 'Discover Mexico with our curated travel experiences')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <Card key={pkg.id} className={`group hover:shadow-lg transition-all duration-300 ${pkg.featured ? 'ring-2 ring-primary' : ''}`}>
            {pkg.featured && (
              <div className="absolute -top-2 left-4 z-10">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  {t('travel.featured', 'Featured')}
                </Badge>
              </div>
            )}
            
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={pkg.gallery?.images?.[0]?.url || '/placeholder.svg'}
                alt={pkg.gallery?.images?.[0]?.caption?.[language] || pkg.title[language]}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => toggleFavorite(pkg.id)}
                className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${favorites.has(pkg.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                />
              </button>
              {pkg.is_demo && (
                <Badge className="absolute bottom-2 left-2 bg-secondary text-secondary-foreground">
                  {t('travel.demo', 'Demo')}
                </Badge>
              )}
            </div>

            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                    {pkg.title[language]}
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {pkg.city}, {pkg.region}
                  </div>
                </div>
              </div>
              
              <CardDescription className="line-clamp-2">
                {pkg.description[language]}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {pkg.duration} {t('travel.days', 'days')}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {pkg.availability} {t('travel.spots', 'spots')}
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {pkg.scenario_tags?.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {t('travel.from', 'From')}
                  </span>
                  <span className="font-bold text-lg text-primary">
                    {formatPrice(pkg.pricing_tiers?.standard?.price || 0, pkg.pricing_tiers?.standard?.currency || 'MXN')}
                  </span>
                </div>
              </div>

              <Button 
                onClick={() => handleBookNow(pkg)} 
                className="w-full"
                disabled={pkg.availability === 0}
              >
                {pkg.availability === 0 
                  ? t('travel.sold_out', 'Sold Out')
                  : t('travel.book_now', 'Book Now')
                }
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {packages.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">
            {t('travel.no_packages', 'No packages available')}
          </h3>
          <p className="text-muted-foreground">
            {t('travel.check_back', 'Check back soon for new travel experiences')}
          </p>
        </div>
      )}

      {selectedPackage && (
        <TravelBookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedPackage(null);
          }}
          package={selectedPackage}
        />
      )}
    </div>
  );
};