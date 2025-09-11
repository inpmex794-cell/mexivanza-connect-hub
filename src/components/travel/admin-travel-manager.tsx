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
import { Plus, Edit, Trash2, Save, Eye, Star, MapPin, Calendar } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface TravelPackage {
  id?: string;
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

export const AdminTravelManager: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState<TravelPackage | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const emptyPackage: TravelPackage = {
    title: { es: '', en: '' },
    description: { es: '', en: '' },
    region: '',
    city: '',
    scenario_tags: [],
    duration: 1,
    pricing_tiers: {
      standard: { price: 0, currency: 'MXN', includes: [] },
      premium: { price: 0, currency: 'MXN', includes: [] }
    },
    itinerary: { days: [] },
    gallery: { images: [] },
    availability: 0,
    featured: false,
    is_published: false,
    is_demo: false
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_packages')
        .select('*')
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

  const handleSavePackage = async (packageData: TravelPackage) => {
    try {
      const dataToSave = {
        ...packageData,
        created_by: user?.id,
        updated_at: new Date().toISOString()
      };

      let error;
      if (packageData.id) {
        const { error: updateError } = await supabase
          .from('travel_packages')
          .update(dataToSave)
          .eq('id', packageData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('travel_packages')
          .insert([dataToSave]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: t('success.saved', 'Saved'),
        description: t('travel.package_saved', 'Travel package saved successfully'),
      });

      setShowEditor(false);
      setEditingPackage(null);
      fetchPackages();
    } catch (error) {
      console.error('Error saving package:', error);
      toast({
        title: t('error.saving', 'Save Error'),
        description: t('travel.save_failed', 'Failed to save travel package'),
        variant: 'destructive',
      });
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm(t('travel.confirm_delete', 'Are you sure you want to delete this package?'))) {
      return;
    }

    try {
      const { error } = await supabase
        .from('travel_packages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t('success.deleted', 'Deleted'),
        description: t('travel.package_deleted', 'Travel package deleted successfully'),
      });

      fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: t('error.deleting', 'Delete Error'),
        description: t('travel.delete_failed', 'Failed to delete travel package'),
        variant: 'destructive',
      });
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('travel_packages')
        .update({ featured: !featured })
        .eq('id', id);

      if (error) throw error;
      fetchPackages();
    } catch (error) {
      console.error('Error updating featured status:', error);
    }
  };

  const togglePublished = async (id: string, published: boolean) => {
    try {
      const { error } = await supabase
        .from('travel_packages')
        .update({ is_published: !published })
        .eq('id', id);

      if (error) throw error;
      fetchPackages();
    } catch (error) {
      console.error('Error updating published status:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('travel.admin_title', 'Travel Package Manager')}</h1>
          <p className="text-muted-foreground">
            {t('travel.admin_subtitle', 'Create and manage travel packages')}
          </p>
        </div>
        
        <Dialog open={showEditor} onOpenChange={setShowEditor}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPackage(emptyPackage)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('travel.new_package', 'New Package')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPackage?.id 
                  ? t('travel.edit_package', 'Edit Package')
                  : t('travel.create_package', 'Create Package')
                }
              </DialogTitle>
            </DialogHeader>
            {editingPackage && (
              <PackageEditor
                package={editingPackage}
                onSave={handleSavePackage}
                onCancel={() => {
                  setShowEditor(false);
                  setEditingPackage(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle>{pkg.title[language]}</CardTitle>
                    {pkg.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        {t('travel.featured', 'Featured')}
                      </Badge>
                    )}
                    {pkg.is_demo && (
                      <Badge variant="secondary">
                        {t('travel.demo', 'Demo')}
                      </Badge>
                    )}
                    {!pkg.is_published && (
                      <Badge variant="outline">
                        {t('travel.draft', 'Draft')}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {pkg.city}, {pkg.region}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {pkg.duration} {t('travel.days', 'days')}
                    </span>
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFeatured(pkg.id!, pkg.featured)}
                  >
                    <Star className={`w-4 h-4 ${pkg.featured ? 'fill-current' : ''}`} />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublished(pkg.id!, pkg.is_published)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingPackage(pkg);
                      setShowEditor(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePackage(pkg.id!)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-2">{t('travel.description', 'Description')}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {pkg.description[language]}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">{t('travel.pricing', 'Pricing')}</h4>
                  <div className="space-y-1 text-sm">
                    <div>Standard: ${pkg.pricing_tiers?.standard?.price?.toLocaleString()}</div>
                    <div>Premium: ${pkg.pricing_tiers?.premium?.price?.toLocaleString()}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">{t('travel.availability', 'Availability')}</h4>
                  <div className="text-sm">
                    {pkg.availability} {t('travel.spots', 'spots available')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">
            {t('travel.no_packages', 'No packages created yet')}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t('travel.create_first', 'Create your first travel package to get started')}
          </p>
          <Button onClick={() => {
            setEditingPackage(emptyPackage);
            setShowEditor(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            {t('travel.create_package', 'Create Package')}
          </Button>
        </div>
      )}
    </div>
  );
};

// Package Editor Component
const PackageEditor: React.FC<{
  package: TravelPackage;
  onSave: (pkg: TravelPackage) => void;
  onCancel: () => void;
}> = ({ package: pkg, onSave, onCancel }) => {
  const { t, language } = useLanguage();
  const [packageData, setPackageData] = useState<TravelPackage>(pkg);

  const updatePackageData = (field: string, value: any) => {
    setPackageData(prev => ({ ...prev, [field]: value }));
  };

  const updateBilingualField = (field: string, lang: 'es' | 'en', value: string) => {
    setPackageData(prev => ({
      ...prev,
      [field]: { ...prev[field as keyof TravelPackage] as any, [lang]: value }
    }));
  };

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">{t('travel.basic_info', 'Basic Info')}</TabsTrigger>
        <TabsTrigger value="pricing">{t('travel.pricing', 'Pricing')}</TabsTrigger>
        <TabsTrigger value="itinerary">{t('travel.itinerary', 'Itinerary')}</TabsTrigger>
        <TabsTrigger value="settings">{t('travel.settings', 'Settings')}</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>{t('travel.title_es', 'Title (Spanish)')}</Label>
            <Input
              value={packageData.title.es}
              onChange={(e) => updateBilingualField('title', 'es', e.target.value)}
              placeholder="Título del paquete"
            />
          </div>
          <div>
            <Label>{t('travel.title_en', 'Title (English)')}</Label>
            <Input
              value={packageData.title.en}
              onChange={(e) => updateBilingualField('title', 'en', e.target.value)}
              placeholder="Package title"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>{t('travel.description_es', 'Description (Spanish)')}</Label>
            <Textarea
              value={packageData.description.es}
              onChange={(e) => updateBilingualField('description', 'es', e.target.value)}
              placeholder="Descripción del paquete"
              rows={4}
            />
          </div>
          <div>
            <Label>{t('travel.description_en', 'Description (English)')}</Label>
            <Textarea
              value={packageData.description.en}
              onChange={(e) => updateBilingualField('description', 'en', e.target.value)}
              placeholder="Package description"
              rows={4}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>{t('travel.region', 'Region')}</Label>
            <Input
              value={packageData.region}
              onChange={(e) => updatePackageData('region', e.target.value)}
              placeholder="e.g., Yucatan Peninsula"
            />
          </div>
          <div>
            <Label>{t('travel.city', 'City')}</Label>
            <Input
              value={packageData.city}
              onChange={(e) => updatePackageData('city', e.target.value)}
              placeholder="e.g., Cancún"
            />
          </div>
          <div>
            <Label>{t('travel.duration', 'Duration (days)')}</Label>
            <Input
              type="number"
              value={packageData.duration}
              onChange={(e) => updatePackageData('duration', parseInt(e.target.value))}
              min="1"
            />
          </div>
        </div>

        <div>
          <Label>{t('travel.tags', 'Tags (comma separated)')}</Label>
          <Input
            value={packageData.scenario_tags?.join(', ')}
            onChange={(e) => updatePackageData('scenario_tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
            placeholder="beach, adventure, cultural"
          />
        </div>
      </TabsContent>

      <TabsContent value="pricing" className="space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('travel.standard', 'Standard Package')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t('travel.price', 'Price')}</Label>
                <Input
                  type="number"
                  value={packageData.pricing_tiers?.standard?.price || 0}
                  onChange={(e) => {
                    const newPricing = { ...packageData.pricing_tiers };
                    newPricing.standard.price = parseFloat(e.target.value);
                    updatePackageData('pricing_tiers', newPricing);
                  }}
                />
              </div>
              <div>
                <Label>{t('travel.includes', 'Includes (one per line)')}</Label>
                <Textarea
                  value={packageData.pricing_tiers?.standard?.includes?.join('\n')}
                  onChange={(e) => {
                    const newPricing = { ...packageData.pricing_tiers };
                    newPricing.standard.includes = e.target.value.split('\n').filter(Boolean);
                    updatePackageData('pricing_tiers', newPricing);
                  }}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('travel.premium', 'Premium Package')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t('travel.price', 'Price')}</Label>
                <Input
                  type="number"
                  value={packageData.pricing_tiers?.premium?.price || 0}
                  onChange={(e) => {
                    const newPricing = { ...packageData.pricing_tiers };
                    newPricing.premium.price = parseFloat(e.target.value);
                    updatePackageData('pricing_tiers', newPricing);
                  }}
                />
              </div>
              <div>
                <Label>{t('travel.includes', 'Includes (one per line)')}</Label>
                <Textarea
                  value={packageData.pricing_tiers?.premium?.includes?.join('\n')}
                  onChange={(e) => {
                    const newPricing = { ...packageData.pricing_tiers };
                    newPricing.premium.includes = e.target.value.split('\n').filter(Boolean);
                    updatePackageData('pricing_tiers', newPricing);
                  }}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="itinerary" className="space-y-4">
        <div className="text-center py-8 text-muted-foreground">
          <p>{t('travel.itinerary_placeholder', 'Itinerary builder coming soon...')}</p>
          <p className="text-sm">{t('travel.manual_edit', 'For now, packages can be edited manually in the database.')}</p>
        </div>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <div>
          <Label>{t('travel.availability', 'Availability (spots)')}</Label>
          <Input
            type="number"
            value={packageData.availability}
            onChange={(e) => updatePackageData('availability', parseInt(e.target.value))}
            min="0"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>{t('travel.featured', 'Featured Package')}</Label>
            <p className="text-sm text-muted-foreground">{t('travel.featured_desc', 'Show this package prominently')}</p>
          </div>
          <Switch
            checked={packageData.featured}
            onCheckedChange={(checked) => updatePackageData('featured', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>{t('travel.published', 'Published')}</Label>
            <p className="text-sm text-muted-foreground">{t('travel.published_desc', 'Make this package visible to users')}</p>
          </div>
          <Switch
            checked={packageData.is_published}
            onCheckedChange={(checked) => updatePackageData('is_published', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>{t('travel.demo', 'Demo Package')}</Label>
            <p className="text-sm text-muted-foreground">{t('travel.demo_desc', 'Mark as demo content')}</p>
          </div>
          <Switch
            checked={packageData.is_demo}
            onCheckedChange={(checked) => updatePackageData('is_demo', checked)}
          />
        </div>
      </TabsContent>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          {t('common.cancel', 'Cancel')}
        </Button>
        <Button onClick={() => onSave(packageData)}>
          <Save className="w-4 h-4 mr-2" />
          {t('common.save', 'Save')}
        </Button>
      </div>
    </Tabs>
  );
};