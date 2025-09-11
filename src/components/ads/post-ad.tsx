import React, { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  Plus,
  Image as ImageIcon,
  Calendar,
  MapPin,
  DollarSign,
  Tag,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface AdFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  price: string;
  currency: string;
  image_url: string;
  expires_at: string;
}

interface Ad {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  price: number;
  currency: string;
  image_url?: string;
  expires_at: string;
  status: string;
  created_at: string;
  user_id: string;
}

const categories = [
  'Travel',
  'Legal',
  'Digital', 
  'Real Estate',
  'Automotive',
  'Healthcare',
  'Education',
  'Restaurant',
  'Services',
  'Products',
  'Events'
];

const locations = [
  'Mexico City',
  'Guadalajara',
  'Monterrey',
  'Cancún',
  'Tijuana',
  'León',
  'Puebla',
  'Mérida',
  'Querétaro',
  'Toluca'
];

export const PostAd: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<AdFormData>({
    title: '',
    description: '',
    category: '',
    location: '',
    price: '',
    currency: 'MXN',
    image_url: '',
    expires_at: ''
  });
  const [userAds, setUserAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');

  const handleInputChange = (field: keyof AdFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    return formData.title.trim() && 
           formData.description.trim() && 
           formData.category && 
           formData.location;
  };

  const submitAd = async () => {
    if (!validateForm()) {
      alert(t("ads.validation_error", "Please fill in all required fields"));
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert(t("ads.login_required", "Please login to post ads"));
        return;
      }

      const adData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        price: formData.price ? parseFloat(formData.price) : null,
        currency: formData.currency,
        image_url: formData.image_url || null,
        expires_at: formData.expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: user.id,
        status: 'pending'
      };

      const { error } = await supabase
        .from('ads')
        .insert([adData]);

      if (error) throw error;

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        location: '',
        price: '',
        currency: 'MXN',
        image_url: '',
        expires_at: ''
      });

      alert(t("ads.success", "Ad posted successfully! It will be reviewed before going live."));
      loadUserAds(); // Refresh ads list
    } catch (error) {
      console.error('Error posting ad:', error);
      alert(t("ads.error", "Error posting ad. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const loadUserAds = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserAds(data || []);
    } catch (error) {
      console.error('Error loading ads:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            {t("ads.active", "Active")}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            {t("ads.pending", "Pending Review")}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            {t("ads.rejected", "Rejected")}
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="outline">
            {t("ads.expired", "Expired")}
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'MXN') => {
    if (!amount) return '';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  React.useEffect(() => {
    if (activeTab === 'manage') {
      loadUserAds();
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{t("ads.title", "Post Advertisement")}</h1>
        <p className="text-muted-foreground">
          {t("ads.subtitle", "Promote your services and products to the Mexivanza community")}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit mx-auto">
        <Button
          variant={activeTab === 'create' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('create')}
          className="rounded-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("ads.create", "Create Ad")}
        </Button>
        <Button
          variant={activeTab === 'manage' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('manage')}
          className="rounded-md"
        >
          <Eye className="w-4 h-4 mr-2" />
          {t("ads.manage", "My Ads")}
        </Button>
      </div>

      {activeTab === 'create' ? (
        /* Create Ad Form */
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{t("ads.create_new", "Create New Advertisement")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("ads.title_label", "Title")} *
                  </label>
                  <Input
                    placeholder={t("ads.title_placeholder", "Enter a descriptive title")}
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("ads.description_label", "Description")} *
                  </label>
                  <Textarea
                    placeholder={t("ads.description_placeholder", "Describe your offering in detail")}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("ads.category_label", "Category")} *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="">{t("ads.select_category", "Select Category")}</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("ads.location_label", "Location")} *
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="">{t("ads.select_location", "Select Location")}</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("ads.price_label", "Price (Optional)")}
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("ads.expires_label", "Expires On")}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={formData.expires_at}
                        onChange={(e) => handleInputChange('expires_at', e.target.value)}
                        className="pl-10"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("ads.image_label", "Image URL (Optional)")}
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("ads.image_placeholder", "Enter image URL")}
                      value={formData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              {(formData.title || formData.description) && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3">{t("ads.preview", "Preview")}</h3>
                  <Card className="border-2 border-dashed">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          {formData.image_url ? (
                            <img
                              src={formData.image_url}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {formData.title || t("ads.title_placeholder", "Enter a descriptive title")}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formData.description || t("ads.description_placeholder", "Describe your offering in detail")}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            {formData.category && (
                              <Badge variant="secondary" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {formData.category}
                              </Badge>
                            )}
                            {formData.location && (
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                {formData.location}
                              </Badge>
                            )}
                            {formData.price && (
                              <span className="text-sm font-semibold text-primary">
                                {formatCurrency(parseFloat(formData.price), formData.currency)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Submit */}
              <Button
                onClick={submitAd}
                disabled={!validateForm() || loading}
                className="w-full"
              >
                {loading ? t("ads.posting", "Posting...") : t("ads.post", "Post Advertisement")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Manage Ads */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t("ads.my_ads", "My Advertisements")}</h2>
            <Badge variant="secondary">
              {userAds.length} {t("ads.total", "total")}
            </Badge>
          </div>

          {userAds.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Plus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t("ads.no_ads", "No ads yet")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t("ads.no_ads_desc", "Create your first advertisement to start promoting your services.")}
                </p>
                <Button onClick={() => setActiveTab('create')}>
                  {t("ads.create_first", "Create First Ad")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userAds.map((ad) => (
                <Card key={ad.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-sm line-clamp-2">{ad.title}</h3>
                        {getStatusBadge(ad.status)}
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {ad.description}
                      </p>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {ad.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {ad.location}
                        </Badge>
                      </div>
                      
                      {ad.price > 0 && (
                        <div className="text-sm font-semibold text-primary">
                          {formatCurrency(ad.price, ad.currency)}
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        {t("ads.created", "Created")}: {new Date(ad.created_at).toLocaleDateString()}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {t("ads.expires", "Expires")}: {new Date(ad.expires_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};