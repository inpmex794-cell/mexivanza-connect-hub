import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Building, 
  Globe, 
  Upload, 
  Eye, 
  Save, 
  Palette,
  Layout,
  Image as ImageIcon,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface BusinessTemplate {
  id: string;
  name: string;
  category: string;
  preview: string;
  features: string[];
}

export const BusinessMicrositeBuilder: React.FC = () => {
  const { t } = useLanguage();
  const { user, userRole } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [businessData, setBusinessData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    phone: '',
    email: '',
    website: '',
    logo_url: '',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#10b981'
    }
  });
  const [isBuilding, setIsBuilding] = useState(false);

  const templates: BusinessTemplate[] = [
    {
      id: 'travel-agency',
      name: t('templates.travel_agency', 'Agencia de Viajes'),
      category: 'Travel',
      preview: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300',
      features: ['Galería de destinos', 'Sistema de reservas', 'Testimonios', 'Contacto']
    },
    {
      id: 'law-firm',
      name: t('templates.law_firm', 'Despacho Legal'),
      category: 'Legal',
      preview: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300',
      features: ['Servicios legales', 'Equipo de abogados', 'Consulta online', 'Blog jurídico']
    },
    {
      id: 'real-estate',
      name: t('templates.real_estate', 'Inmobiliaria'),
      category: 'Real Estate',
      preview: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300',
      features: ['Catálogo de propiedades', 'Búsqueda avanzada', 'Tours virtuales', 'Calculadora']
    },
    {
      id: 'restaurant',
      name: t('templates.restaurant', 'Restaurante'),
      category: 'Food',
      preview: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300',
      features: ['Menú digital', 'Reservas online', 'Galería de platillos', 'Delivery']
    },
    {
      id: 'tech-startup',
      name: t('templates.tech_startup', 'Startup Tecnológica'),
      category: 'Technology',
      preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300',
      features: ['Landing moderna', 'Portfolio', 'Equipo', 'Contacto']
    }
  ];

  const categories = [
    'Travel', 'Legal', 'Real Estate', 'Food', 'Technology', 
    'Health', 'Education', 'Retail', 'Finance', 'Other'
  ];

  // Check if user is verified
  if (!user || userRole !== 'verified') {
    return (
      <Card className="shadow-sm border-border bg-card">
        <CardContent className="p-8 text-center">
          <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {t('builder.verification_required', 'Verificación Requerida')}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t('builder.verification_desc', 'Necesitas ser un usuario verificado para crear micrositios')}
          </p>
          <Button variant="default">
            {t('button.upgrade', 'Actualizar a Verificado')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setBusinessData(prev => ({ ...prev, category: template.category }));
    }
  };

  const handleBuildSite = async () => {
    if (!selectedTemplate || !businessData.name || !businessData.description) {
      toast.error(t('builder.complete_fields', 'Completa todos los campos requeridos'));
      return;
    }

    setIsBuilding(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .insert([{
          user_id: user.id,
          name: businessData.name,
          description: businessData.description,
          category: businessData.category,
          location: businessData.location,
          phone: businessData.phone,
          website: businessData.website,
          logo_url: businessData.logo_url,
          template_enabled: true,
          verification_status: 'pending'
        }]);

      if (error) throw error;

      toast.success(t('builder.site_created', 'Micrositio creado exitosamente'));
      toast.info(t('builder.pending_approval', 'Pendiente de aprobación administrativa'));
      
      // Reset form
      setSelectedTemplate('');
      setBusinessData({
        name: '',
        description: '',
        category: '',
        location: '',
        phone: '',
        email: '',
        website: '',
        logo_url: '',
        colors: { primary: '#3b82f6', secondary: '#64748b', accent: '#10b981' }
      });
    } catch (error) {
      console.error('Error creating business:', error);
      toast.error(t('builder.error_creating', 'Error al crear el micrositio'));
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-sm border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-6 w-6 mr-2 text-primary" />
            {t('builder.title', 'Constructor de Micrositios')}
          </CardTitle>
          <p className="text-muted-foreground">
            {t('builder.description', 'Crea tu sitio web profesional con nuestras plantillas verificadas')}
          </p>
        </CardHeader>
      </Card>

      {/* Template Selection */}
      <Card className="shadow-sm border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Layout className="h-5 w-5 mr-2" />
            {t('builder.select_template', 'Selecciona una Plantilla')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <h4 className="font-medium mb-1">{template.name}</h4>
                <Badge variant="secondary" className="mb-2">
                  {template.category}
                </Badge>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {template.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Information */}
      {selectedTemplate && (
        <Card className="shadow-sm border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Building className="h-5 w-5 mr-2" />
              {t('builder.business_info', 'Información del Negocio')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('form.business_name', 'Nombre del Negocio')} *
                </label>
                <Input
                  placeholder={t('form.business_name_placeholder', 'Mi Empresa S.A.')}
                  value={businessData.name}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('form.category', 'Categoría')} *
                </label>
                <Select value={businessData.category} onValueChange={(value) => setBusinessData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('form.select_category', 'Selecciona categoría')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('form.description', 'Descripción')} *
              </label>
              <Textarea
                placeholder={t('form.business_description', 'Describe tu negocio...')}
                value={businessData.description}
                onChange={(e) => setBusinessData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {t('form.location', 'Ubicación')}
                </label>
                <Input
                  placeholder={t('form.location_placeholder', 'Ciudad, Estado')}
                  value={businessData.location}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {t('form.phone', 'Teléfono')}
                </label>
                <Input
                  placeholder="+52 555 123 4567"
                  value={businessData.phone}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {t('form.email', 'Email')}
                </label>
                <Input
                  type="email"
                  placeholder="contacto@miempresa.com"
                  value={businessData.email}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  {t('form.website', 'Sitio Web')}
                </label>
                <Input
                  placeholder="https://miempresa.com"
                  value={businessData.website}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block flex items-center">
                <ImageIcon className="h-4 w-4 mr-1" />
                {t('form.logo_url', 'URL del Logo')}
              </label>
              <Input
                placeholder="https://ejemplo.com/logo.png"
                value={businessData.logo_url}
                onChange={(e) => setBusinessData(prev => ({ ...prev, logo_url: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {selectedTemplate && (
        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {t('builder.admin_approval', 'Tu micrositio será revisado por un administrador antes de publicarse')}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  {t('button.preview', 'Vista Previa')}
                </Button>
                <Button 
                  onClick={handleBuildSite}
                  disabled={isBuilding}
                  className="flex items-center"
                >
                  {isBuilding ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('button.building', 'Construyendo...')}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {t('button.build_site', 'Construir Sitio')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};