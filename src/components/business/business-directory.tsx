import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { 
  Building, 
  MapPin, 
  Phone, 
  Globe, 
  Star, 
  Shield, 
  Search, 
  Filter,
  Users,
  Clock,
  MessageSquare,
  ExternalLink,
  Plus,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Business {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  phone?: string;
  website?: string;
  logo_url?: string;
  verified: boolean;
  verification_status: string;
  rating: number;
  review_count: number;
  created_at: string;
  user_id: string;
  profiles?: {
    name: string;
    avatar_url?: string;
  } | null;
}

interface BusinessDirectoryProps {
  showSubmissionForm?: boolean;
}

export const BusinessDirectory: React.FC<BusinessDirectoryProps> = ({ 
  showSubmissionForm = false 
}) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const categories = [
    { value: 'all', label: t('directory.all_categories', 'Todas las categorías') },
    { value: 'travel', label: t('directory.travel', 'Viajes') },
    { value: 'legal', label: t('directory.legal', 'Legal') },
    { value: 'real_estate', label: t('directory.real_estate', 'Bienes Raíces') },
    { value: 'web_development', label: t('directory.web_development', 'Desarrollo Web') },
    { value: 'immigration', label: t('directory.immigration', 'Inmigración') },
    { value: 'business', label: t('directory.business', 'Negocios') },
    { value: 'consulting', label: t('directory.consulting', 'Consultoría') },
    { value: 'marketing', label: t('directory.marketing', 'Marketing') }
  ];

  const locations = [
    { value: 'all', label: t('directory.all_locations', 'Todas las ubicaciones') },
    { value: 'mexico_city', label: 'Ciudad de México' },
    { value: 'guadalajara', label: 'Guadalajara' },
    { value: 'monterrey', label: 'Monterrey' },
    { value: 'cancun', label: 'Cancún' },
    { value: 'tijuana', label: 'Tijuana' },
    { value: 'puebla', label: 'Puebla' },
    { value: 'merida', label: 'Mérida' },
    { value: 'queretaro', label: 'Querétaro' }
  ];

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    filterBusinesses();
  }, [businesses, searchTerm, selectedCategory, selectedLocation, showVerifiedOnly]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('verification_status', 'verified')
        .order('verified', { ascending: false })
        .order('rating', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBusinesses(data || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      toast.error(t('directory.fetch_error', 'Error al cargar negocios'));
    } finally {
      setLoading(false);
    }
  };

  const filterBusinesses = () => {
    let filtered = [...businesses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(business =>
        business.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(business =>
        business.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Verified filter
    if (showVerifiedOnly) {
      filtered = filtered.filter(business => business.verified);
    }

    setFilteredBusinesses(filtered);
  };

  const BusinessCard: React.FC<{ business: Business }> = ({ business }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src={business.logo_url} alt={business.name} />
              <AvatarFallback>
                <Building className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-lg truncate">{business.name}</CardTitle>
                {business.verified && (
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    <Shield className="h-3 w-3 mr-1" />
                    {t('directory.verified', 'Verificado')}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {business.location}
                </span>
                {business.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {business.rating.toFixed(1)} ({business.review_count})
                  </span>
                )}
              </div>
            </div>
          </div>
          <Badge variant="outline">{business.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4 line-clamp-2">
          {business.description}
        </CardDescription>
        
        <div className="space-y-3">
          {/* Contact Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              {business.phone && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {business.phone}
                </span>
              )}
              {business.website && (
                <Button variant="ghost" size="sm" asChild className="h-6 px-2">
                  <a href={business.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-3 w-3 mr-1" />
                    {t('directory.website', 'Sitio web')}
                  </a>
                </Button>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {t('directory.member_since', 'Miembro desde')} {new Date(business.created_at).getFullYear()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <WhatsAppButton
              message={t('directory.whatsapp_message', `Hola, vi tu negocio "${business.name}" en Mexivanza y me interesa saber más.`)}
              className="flex-1 bg-[#25D366] hover:bg-[#25D366]/90 text-white"
              size="sm"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {t('button.contact_whatsapp', 'WhatsApp')}
            </WhatsAppButton>
            <Button variant="outline" size="sm" className="flex-1">
              <Users className="h-4 w-4 mr-2" />
              {t('directory.view_profile', 'Ver perfil')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SearchAndFilters = () => (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('directory.search_placeholder', 'Buscar negocios, servicios, ubicaciones...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t('directory.select_category', 'Seleccionar categoría')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder={t('directory.select_location', 'Seleccionar ubicación')} />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button
                variant={showVerifiedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                className="flex-1"
              >
                <Shield className="h-4 w-4 mr-2" />
                {t('directory.verified_only', 'Solo verificados')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLocation('all');
                setShowVerifiedOnly(false);
              }}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DirectoryStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{businesses.length}</div>
          <div className="text-sm text-muted-foreground">
            {t('directory.total_businesses', 'Negocios totales')}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-success">
            {businesses.filter(b => b.verified).length}
          </div>
          <div className="text-sm text-muted-foreground">
            {t('directory.verified_businesses', 'Verificados')}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {new Set(businesses.map(b => b.category)).size}
          </div>
          <div className="text-sm text-muted-foreground">
            {t('directory.categories', 'Categorías')}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {new Set(businesses.map(b => b.location)).size}
          </div>
          <div className="text-sm text-muted-foreground">
            {t('directory.locations', 'Ubicaciones')}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          {t('directory.title', 'Directorio de Negocios')}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t('directory.subtitle', 'Descubre negocios verificados en toda México')}
        </p>
      </div>

      {/* Stats */}
      <DirectoryStats />

      {/* Search and Filters */}
      <SearchAndFilters />

      {/* Add Business Button */}
      {user && (
        <div className="flex justify-center">
          <Button className="bg-primary hover:bg-primary-hover">
            <Plus className="h-4 w-4 mr-2" />
            {t('directory.add_business', 'Agregar mi negocio')}
          </Button>
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {t('directory.results', 'Resultados')} ({filteredBusinesses.length})
          </h2>
          <div className="text-sm text-muted-foreground">
            {searchTerm && (
              <span>
                {t('directory.searching_for', 'Buscando')}: "<strong>{searchTerm}</strong>"
              </span>
            )}
          </div>
        </div>

        {filteredBusinesses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {t('directory.no_results', 'No se encontraron negocios')}
              </h3>
              <p className="text-muted-foreground">
                {t('directory.no_results_desc', 'Intenta ajustar tus filtros de búsqueda')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};