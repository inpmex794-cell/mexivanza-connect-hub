import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Upload, 
  Phone, 
  Globe, 
  MapPin, 
  FileText, 
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BusinessSubmissionFormProps {
  onSubmissionComplete?: () => void;
}

export const BusinessSubmissionForm: React.FC<BusinessSubmissionFormProps> = ({
  onSubmissionComplete
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    phone: '',
    website: '',
    documents: '' // For verification documents
  });

  const categories = [
    { value: 'travel', label: t('directory.travel', 'Viajes') },
    { value: 'legal', label: t('directory.legal', 'Legal') },
    { value: 'real_estate', label: t('directory.real_estate', 'Bienes Raíces') },
    { value: 'web_development', label: t('directory.web_development', 'Desarrollo Web') },
    { value: 'immigration', label: t('directory.immigration', 'Inmigración') },
    { value: 'business', label: t('directory.business', 'Negocios') },
    { value: 'consulting', label: t('directory.consulting', 'Consultoría') },
    { value: 'marketing', label: t('directory.marketing', 'Marketing') }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['name', 'description', 'category', 'location'];
    const missing = required.filter(field => !formData[field as keyof typeof formData]);
    
    if (missing.length > 0) {
      toast.error(t('form.required_fields', 'Por favor completa todos los campos requeridos'));
      return false;
    }

    if (formData.website && !formData.website.startsWith('http')) {
      setFormData(prev => ({ ...prev, website: `https://${prev.website}` }));
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(t('auth.login_required', 'Debes iniciar sesión para continuar'));
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .insert([{
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          phone: formData.phone || null,
          website: formData.website || null,
          documents: formData.documents || null,
          verified: false,
          verification_status: 'pending',
          rating: 0.0,
          review_count: 0
        }]);

      if (error) throw error;

      toast.success(t('business.submission_success', 'Negocio enviado para revisión exitosamente'));
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        location: '',
        phone: '',
        website: '',
        documents: ''
      });

      onSubmissionComplete?.();
    } catch (error) {
      console.error('Error submitting business:', error);
      toast.error(t('business.submission_error', 'Error al enviar negocio'));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {t('business.add_your_business', 'Agregar tu negocio')}
          </CardTitle>
          <CardDescription>
            {t('business.login_required_desc', 'Inicia sesión para agregar tu negocio al directorio')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {t('auth.login_required', 'Debes iniciar sesión para continuar')}
            </p>
            <Button>
              {t('auth.login', 'Iniciar sesión')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          {t('business.add_your_business', 'Agregar tu negocio')}
        </CardTitle>
        <CardDescription>
          {t('business.submission_desc', 'Comparte tu negocio con miles de usuarios en Mexivanza')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Info className="h-5 w-5" />
              {t('business.basic_info', 'Información básica')}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('form.business_name', 'Nombre del negocio')} *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('form.business_name_placeholder', 'Ej: García Legal Services')}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('form.category', 'Categoría')} *
                </label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('form.select_category', 'Seleccionar categoría')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('form.description', 'Descripción')} *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={t('form.description_placeholder', 'Describe tu negocio, servicios y lo que te hace único...')}
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('form.location', 'Ubicación')} *
              </label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder={t('form.location_placeholder', 'Ej: Ciudad de México, CDMX')}
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Phone className="h-5 w-5" />
              {t('business.contact_info', 'Información de contacto')}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('form.phone', 'Teléfono')}
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+52 55 1234 5678"
                  type="tel"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('form.website', 'Sitio web')}
                </label>
                <Input
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="www.misitioweb.com"
                  type="url"
                />
              </div>
            </div>
          </div>

          {/* Verification Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('business.verification_docs', 'Documentos de verificación')}
            </h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('form.documents', 'Documentos')}
              </label>
              <Textarea
                value={formData.documents}
                onChange={(e) => handleInputChange('documents', e.target.value)}
                placeholder={t('form.documents_placeholder', 'Lista los documentos que puedes proporcionar para verificación (RFC, licencias, certificaciones, etc.)')}
                rows={3}
              />
            </div>
          </div>

          {/* Submission Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium">
                  {t('business.approval_process', 'Proceso de aprobación')}
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {t('business.review_time', 'Revisión en 24-48 horas')}</li>
                  <li>• {t('business.verification_required', 'Verificación de documentos requerida')}</li>
                  <li>• {t('business.notification_email', 'Te notificaremos por email del resultado')}</li>
                  <li>• {t('business.free_listing', 'Listado gratuito para usuarios verificados')}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t('button.submitting', 'Enviando...')}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  {t('button.submit_business', 'Enviar para revisión')}
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};