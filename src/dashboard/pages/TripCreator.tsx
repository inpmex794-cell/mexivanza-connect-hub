import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ItineraryBuilder } from '../components/ItineraryBuilder';
import { api } from '../services/api';
import { 
  Save, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Star,
  Tag,
  Image,
  Plane,
  Shield,
  Truck,
  Plus,
  X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TripFormData {
  title: string;
  slug: string;
  description: string;
  trip_type: string;
  duration_days: number;
  price: number;
  currency: string;
  featured: boolean;
  destination_id: string;
  category_id: string;
  tags: string[];
  images: string[];
  availability: string;
  services: string[];
  features: string[];
  insurance_included: boolean;
  transport_options: string[];
  itinerary: any[];
}

const TRIP_TYPES = [
  'Adventure',
  'Cultural',
  'Wellness',
  'Luxury',
  'Beach',
  'City',
  'Nature',
  'Family',
  'Romantic',
  'Business'
];

const TRANSPORT_OPTIONS = [
  'Private Car',
  'Bus',
  'Flight',
  'Train',
  'Boat',
  'Walking',
  'Bicycle'
];

export function TripCreator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [services, setServices] = useState([]);
  const [features, setFeatures] = useState([]);
  
  const [formData, setFormData] = useState<TripFormData>({
    title: '',
    slug: '',
    description: '',
    trip_type: '',
    duration_days: 1,
    price: 0,
    currency: 'MXN',
    featured: false,
    destination_id: '',
    category_id: '',
    tags: [],
    images: [],
    availability: '',
    services: [],
    features: [],
    insurance_included: false,
    transport_options: [],
    itinerary: []
  });

  const [newTag, setNewTag] = useState('');
  const [newImage, setNewImage] = useState('');

  useEffect(() => {
    fetchFormData();
    if (isEdit) {
      fetchTripData();
    }
  }, [id, isEdit]);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const [
        destinationsRes,
        categoriesRes,
        tagsRes,
        servicesRes,
        featuresRes
      ] = await Promise.all([
        api.getDestinations(),
        api.getCategories(),
        api.getTags(),
        api.getServices(),
        api.getFeatures()
      ]);

      if (destinationsRes.success) setDestinations(destinationsRes.data);
      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (tagsRes.success) setTags(tagsRes.data);
      if (servicesRes.success) setServices(servicesRes.data);
      if (featuresRes.success) setFeatures(featuresRes.data);
    } catch (error) {
      console.error('Error fetching form data:', error);
      toast({
        title: "Error",
        description: "Failed to load form data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTripData = async () => {
    try {
      // This would fetch existing trip data for editing
      // const response = await api.getTrip(id);
      // if (response.success) {
      //   setFormData(response.data);
      // }
    } catch (error) {
      console.error('Error fetching trip:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (field: keyof TripFormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug from title
      if (field === 'title') {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };

  const handleArrayAdd = (field: 'tags' | 'images' | 'services' | 'features' | 'transport_options', value: string) => {
    if (!value || formData[field].includes(value)) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value]
    }));
  };

  const handleArrayRemove = (field: 'tags' | 'images' | 'services' | 'features' | 'transport_options', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validate required fields
      if (!formData.title || !formData.description || !formData.destination_id) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      const tripData = {
        ...formData,
        status: 'published',
        is_published: true
      };

      let response;
      if (isEdit) {
        response = await api.updateTrip({ id, ...tripData });
      } else {
        response = await api.createTrip(tripData);
      }

      if (response.success) {
        toast({
          title: "Success",
          description: `Trip ${isEdit ? 'updated' : 'created'} successfully`
        });
        navigate('/dashboard/trips');
      } else {
        throw new Error(response.message || 'Failed to save trip');
      }
    } catch (error) {
      console.error('Error saving trip:', error);
      toast({
        title: "Error",
        description: "Failed to save trip",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/trips')}
          >
            <ArrowLeft size={16} />
            <span className="ml-2">Back to Trips</span>
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              {isEdit ? 'Edit Trip' : 'Create New Trip'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isEdit ? 'Update your travel package' : 'Build a complete travel package with itinerary'}
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Saving...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span className="ml-2">{isEdit ? 'Update' : 'Create'} Trip</span>
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details & Media</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plane className="mr-2" size={20} />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Amazing Mexico Adventure"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="amazing-mexico-adventure"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your amazing travel package..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="trip_type">Trip Type</Label>
                  <Select value={formData.trip_type} onValueChange={(value) => handleInputChange('trip_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRIP_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration_days}
                    onChange={(e) => handleInputChange('duration_days', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    />
                    <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MXN">MXN</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination *</Label>
                  <Select value={formData.destination_id} onValueChange={(value) => handleInputChange('destination_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map((dest: any) => (
                        <SelectItem key={dest.id} value={dest.id.toString()}>{dest.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange('featured', checked)}
                />
                <Label htmlFor="featured" className="flex items-center">
                  <Star className="mr-1" size={16} />
                  Featured Trip
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details & Media */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="mr-2" size={20} />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleArrayAdd('tags', newTag);
                        setNewTag('');
                      }
                    }}
                  />
                  <Button 
                    size="sm"
                    onClick={() => {
                      handleArrayAdd('tags', newTag);
                      setNewTag('');
                    }}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <button onClick={() => handleArrayRemove('tags', tag)}>
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="mr-2" size={20} />
                  Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Image URL"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleArrayAdd('images', newImage);
                        setNewImage('');
                      }
                    }}
                  />
                  <Button 
                    size="sm"
                    onClick={() => {
                      handleArrayAdd('images', newImage);
                      setNewImage('');
                    }}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm truncate">{image}</span>
                      <button onClick={() => handleArrayRemove('images', image)}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Included Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {services.map((service: any) => (
                    <label key={service.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service.id.toString())}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleArrayAdd('services', service.id.toString());
                          } else {
                            handleArrayRemove('services', service.id.toString());
                          }
                        }}
                      />
                      <span>{service.name}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {features.map((feature: any) => (
                    <label key={feature.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature.id.toString())}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleArrayAdd('features', feature.id.toString());
                          } else {
                            handleArrayRemove('features', feature.id.toString());
                          }
                        }}
                      />
                      <span>{feature.name}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Itinerary Builder */}
        <TabsContent value="itinerary">
          <ItineraryBuilder
            itinerary={formData.itinerary}
            onChange={(itinerary) => handleInputChange('itinerary', itinerary)}
          />
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trip Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="availability">Availability Period</Label>
                <Input
                  id="availability"
                  type="date"
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label>Transport Options</Label>
                <div className="grid grid-cols-2 gap-2">
                  {TRANSPORT_OPTIONS.map(option => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.transport_options.includes(option)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleArrayAdd('transport_options', option);
                          } else {
                            handleArrayRemove('transport_options', option);
                          }
                        }}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="insurance"
                  checked={formData.insurance_included}
                  onCheckedChange={(checked) => handleInputChange('insurance_included', checked)}
                />
                <Label htmlFor="insurance" className="flex items-center">
                  <Shield className="mr-1" size={16} />
                  Insurance Included
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}