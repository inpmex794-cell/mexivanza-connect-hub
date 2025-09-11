import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, Edit, Trash2, Save, Eye, Star, MapPin, Calendar, Filter,
  Plane, Hotel, Shield, Ship, Home, MapPin as Guide, Bus, Car
} from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface TravelListing {
  id?: string;
  category: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  provider_name: string;
  location: string;
  price_amount: number;
  price_currency: string;
  scenario_tags: string[];
  featured: boolean;
  is_published: boolean;
  is_demo: boolean;
  category_data: any;
  availability: number;
  booking_window: { start_date: string; end_date: string };
  gallery: { images: Array<{ url: string; caption: { es: string; en: string } }> };
  reviews: { rating: number; count: number };
}

export const AdminCategoriesManager: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [listings, setListings] = useState<TravelListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingListing, setEditingListing] = useState<TravelListing | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

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

  const emptyListing: TravelListing = {
    category: 'flights',
    title: { es: '', en: '' },
    description: { es: '', en: '' },
    provider_name: '',
    location: '',
    price_amount: 0,
    price_currency: 'MXN',
    scenario_tags: [],
    featured: false,
    is_published: false,
    is_demo: false,
    category_data: {},
    availability: 0,
    booking_window: { start_date: '', end_date: '' },
    gallery: { images: [] },
    reviews: { rating: 0, count: 0 }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_bookings_categories')
        .select('*')
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

  const handleSaveListing = async (listingData: TravelListing) => {
    try {
      const dataToSave = {
        ...listingData,
        created_by: user?.id,
        updated_at: new Date().toISOString()
      };

      let error;
      if (listingData.id) {
        const { error: updateError } = await supabase
          .from('travel_bookings_categories')
          .update(dataToSave)
          .eq('id', listingData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('travel_bookings_categories')
          .insert([dataToSave]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: t('success.saved', 'Saved'),
        description: t('travel.listing_saved', 'Travel listing saved successfully'),
      });

      setShowEditor(false);
      setEditingListing(null);
      fetchListings();
    } catch (error) {
      console.error('Error saving listing:', error);
      toast({
        title: t('error.saving', 'Save Error'),
        description: t('travel.save_failed', 'Failed to save travel listing'),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm(t('travel.confirm_delete', 'Are you sure you want to delete this listing?'))) {
      return;
    }

    try {
      const { error } = await supabase
        .from('travel_bookings_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t('success.deleted', 'Deleted'),
        description: t('travel.listing_deleted', 'Travel listing deleted successfully'),
      });

      fetchListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast({
        title: t('error.deleting', 'Delete Error'),
        description: t('travel.delete_failed', 'Failed to delete travel listing'),
        variant: 'destructive',
      });
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('travel_bookings_categories')
        .update({ featured: !featured })
        .eq('id', id);

      if (error) throw error;
      fetchListings();
    } catch (error) {
      console.error('Error updating featured status:', error);
    }
  };

  const togglePublished = async (id: string, published: boolean) => {
    try {
      const { error } = await supabase
        .from('travel_bookings_categories')
        .update({ is_published: !published })
        .eq('id', id);

      if (error) throw error;
      fetchListings();
    } catch (error) {
      console.error('Error updating published status:', error);
    }
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

  const filteredListings = filterCategory === 'all' 
    ? listings 
    : listings.filter(listing => listing.category === filterCategory);

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('travel.admin_categories_title', 'Travel Categories Manager')}</h1>
          <p className="text-muted-foreground">
            {t('travel.admin_categories_subtitle', 'Manage all travel service categories')}
          </p>
        </div>
        
        <Dialog open={showEditor} onOpenChange={setShowEditor}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingListing(emptyListing)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('travel.new_listing', 'New Listing')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingListing?.id 
                  ? t('travel.edit_listing', 'Edit Listing')
                  : t('travel.create_listing', 'Create Listing')
                }
              </DialogTitle>
            </DialogHeader>
            {editingListing && (
              <ListingEditor
                listing={editingListing}
                onSave={handleSaveListing}
                onCancel={() => {
                  setShowEditor(false);
                  setEditingListing(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-4 mb-6">
        <Filter className="w-4 h-4" />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name[language]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="outline">
          {filteredListings.length} {t('travel.listings', 'listings')}
        </Badge>
      </div>

      <div className="grid gap-6">
        {filteredListings.map((listing) => {
          const Icon = getCategoryIcon(listing.category);
          return (
            <Card key={listing.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-5 h-5" />
                      <CardTitle>{listing.title[language]}</CardTitle>
                      {listing.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3 mr-1" />
                          {t('travel.featured', 'Featured')}
                        </Badge>
                      )}
                      {listing.is_demo && (
                        <Badge variant="secondary">
                          {t('travel.demo', 'Demo')}
                        </Badge>
                      )}
                      {!listing.is_published && (
                        <Badge variant="outline">
                          {t('travel.draft', 'Draft')}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {listing.location}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {categories.find(c => c.id === listing.category)?.name[language]}
                      </span>
                      <span>{listing.provider_name}</span>
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFeatured(listing.id!, listing.featured)}
                    >
                      <Star className={`w-4 h-4 ${listing.featured ? 'fill-current' : ''}`} />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublished(listing.id!, listing.is_published)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingListing(listing);
                        setShowEditor(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteListing(listing.id!)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">{t('travel.description', 'Description')}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {listing.description[language]}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">{t('travel.pricing', 'Pricing')}</h4>
                    <div className="text-sm">
                      {formatPrice(listing.price_amount, listing.price_currency)}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">{t('travel.availability', 'Availability')}</h4>
                    <div className="text-sm">
                      {listing.availability} {t('travel.spots', 'spots available')}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">{t('travel.tags', 'Tags')}</h4>
                    <div className="flex flex-wrap gap-1">
                      {listing.scenario_tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">
            {t('travel.no_listings', 'No listings found')}
          </h3>
          <p className="text-muted-foreground mb-4">
            {filterCategory === 'all' 
              ? t('travel.create_first_listing', 'Create your first travel listing to get started')
              : t('travel.no_listings_category', 'No listings in this category yet')
            }
          </p>
          <Button onClick={() => {
            setEditingListing(emptyListing);
            setShowEditor(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            {t('travel.create_listing', 'Create Listing')}
          </Button>
        </div>
      )}
    </div>
  );
};

// Listing Editor Component
const ListingEditor: React.FC<{
  listing: TravelListing;
  onSave: (listing: TravelListing) => void;
  onCancel: () => void;
}> = ({ listing, onSave, onCancel }) => {
  const { t, language } = useLanguage();
  const [listingData, setListingData] = useState<TravelListing>(listing);

  const categories = [
    { id: 'flights', name: { es: 'Vuelos', en: 'Flights' } },
    { id: 'hotels', name: { es: 'Hoteles', en: 'Hotels' } },
    { id: 'insurance', name: { es: 'Seguros', en: 'Insurance' } },
    { id: 'cruises', name: { es: 'Cruceros', en: 'Cruises' } },
    { id: 'airbnb', name: { es: 'Airbnb', en: 'Airbnb' } },
    { id: 'tour_guides', name: { es: 'Guías', en: 'Tour Guides' } },
    { id: 'charters', name: { es: 'Charters', en: 'Charters' } },
    { id: 'car_rentals', name: { es: 'Autos', en: 'Car Rentals' } },
  ];

  const updateListingData = (field: string, value: any) => {
    setListingData(prev => ({ ...prev, [field]: value }));
  };

  const updateBilingualField = (field: string, lang: 'es' | 'en', value: string) => {
    setListingData(prev => ({
      ...prev,
      [field]: { ...prev[field as keyof TravelListing] as any, [lang]: value }
    }));
  };

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">{t('travel.basic_info', 'Basic Info')}</TabsTrigger>
        <TabsTrigger value="details">{t('travel.details', 'Details')}</TabsTrigger>
        <TabsTrigger value="settings">{t('travel.settings', 'Settings')}</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <div>
          <Label>{t('travel.category', 'Category')}</Label>
          <Select 
            value={listingData.category}
            onValueChange={(value) => updateListingData('category', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name[language]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>{t('travel.title_es', 'Title (Spanish)')}</Label>
            <Input
              value={listingData.title.es}
              onChange={(e) => updateBilingualField('title', 'es', e.target.value)}
              placeholder="Título del servicio"
            />
          </div>
          <div>
            <Label>{t('travel.title_en', 'Title (English)')}</Label>
            <Input
              value={listingData.title.en}
              onChange={(e) => updateBilingualField('title', 'en', e.target.value)}
              placeholder="Service title"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>{t('travel.description_es', 'Description (Spanish)')}</Label>
            <Textarea
              value={listingData.description.es}
              onChange={(e) => updateBilingualField('description', 'es', e.target.value)}
              placeholder="Descripción del servicio"
              rows={4}
            />
          </div>
          <div>
            <Label>{t('travel.description_en', 'Description (English)')}</Label>
            <Textarea
              value={listingData.description.en}
              onChange={(e) => updateBilingualField('description', 'en', e.target.value)}
              placeholder="Service description"
              rows={4}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>{t('travel.provider_name', 'Provider Name')}</Label>
            <Input
              value={listingData.provider_name}
              onChange={(e) => updateListingData('provider_name', e.target.value)}
              placeholder="e.g., Aeromexico, Grand Oasis"
            />
          </div>
          <div>
            <Label>{t('travel.location', 'Location')}</Label>
            <Input
              value={listingData.location}
              onChange={(e) => updateListingData('location', e.target.value)}
              placeholder="e.g., Cancún, México"
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="details" className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>{t('travel.price_amount', 'Price Amount')}</Label>
            <Input
              type="number"
              value={listingData.price_amount}
              onChange={(e) => updateListingData('price_amount', parseFloat(e.target.value))}
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <Label>{t('travel.currency', 'Currency')}</Label>
            <Select 
              value={listingData.price_currency}
              onValueChange={(value) => updateListingData('price_currency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MXN">MXN (Pesos)</SelectItem>
                <SelectItem value="USD">USD (Dollars)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t('travel.availability', 'Availability')}</Label>
            <Input
              type="number"
              value={listingData.availability}
              onChange={(e) => updateListingData('availability', parseInt(e.target.value))}
              min="0"
            />
          </div>
        </div>

        <div>
          <Label>{t('travel.tags', 'Tags (comma separated)')}</Label>
          <Input
            value={listingData.scenario_tags?.join(', ')}
            onChange={(e) => updateListingData('scenario_tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
            placeholder="luxury, beachfront, all_inclusive"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>{t('travel.booking_start', 'Booking Window Start')}</Label>
            <Input
              type="date"
              value={listingData.booking_window?.start_date || ''}
              onChange={(e) => updateListingData('booking_window', {
                ...listingData.booking_window,
                start_date: e.target.value
              })}
            />
          </div>
          <div>
            <Label>{t('travel.booking_end', 'Booking Window End')}</Label>
            <Input
              type="date"
              value={listingData.booking_window?.end_date || ''}
              onChange={(e) => updateListingData('booking_window', {
                ...listingData.booking_window,
                end_date: e.target.value
              })}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>{t('travel.featured', 'Featured Listing')}</Label>
            <p className="text-sm text-muted-foreground">{t('travel.featured_desc', 'Show this listing prominently')}</p>
          </div>
          <Switch
            checked={listingData.featured}
            onCheckedChange={(checked) => updateListingData('featured', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>{t('travel.published', 'Published')}</Label>
            <p className="text-sm text-muted-foreground">{t('travel.published_desc', 'Make this listing visible to users')}</p>
          </div>
          <Switch
            checked={listingData.is_published}
            onCheckedChange={(checked) => updateListingData('is_published', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>{t('travel.demo', 'Demo Listing')}</Label>
            <p className="text-sm text-muted-foreground">{t('travel.demo_desc', 'Mark as demo content')}</p>
          </div>
          <Switch
            checked={listingData.is_demo}
            onCheckedChange={(checked) => updateListingData('is_demo', checked)}
          />
        </div>
      </TabsContent>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          {t('common.cancel', 'Cancel')}
        </Button>
        <Button onClick={() => onSave(listingData)}>
          <Save className="w-4 h-4 mr-2" />
          {t('common.save', 'Save')}
        </Button>
      </div>
    </Tabs>
  );
};