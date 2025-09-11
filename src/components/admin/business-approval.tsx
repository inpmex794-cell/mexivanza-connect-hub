import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/use-language';
import { supabase } from '@/integrations/supabase/client';
import { 
  Building, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MapPin,
  Phone,
  Globe,
  FileText,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface BusinessApplication {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  phone?: string;
  website?: string;
  logo_url?: string;
  verification_status: string;
  verification_documents?: any;
  template_enabled: boolean;
  payment_enabled: boolean;
  created_at: string;
  user_id: string;
  profiles?: {
    name: string;
    avatar_url?: string;
  };
}

export const BusinessApproval: React.FC = () => {
  const { t } = useLanguage();
  const [applications, setApplications] = useState<BusinessApplication[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [moderating, setModerating] = useState<string | null>(null);

  const fetchBusinessApplications = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          profiles (name, avatar_url)
        `)
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApplications((data as unknown as BusinessApplication[]) || []);
    } catch (error) {
      console.error('Error fetching business applications:', error);
      toast.error(t('admin.error_loading_businesses', 'Error loading business applications'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessApplications();
  }, []);

  const moderateBusiness = async (businessId: string, status: 'verified' | 'rejected') => {
    try {
      setModerating(businessId);
      
      const { error } = await supabase
        .from('businesses')
        .update({ 
          verification_status: status,
          verified: status === 'verified'
        })
        .eq('id', Number(businessId));

      if (error) throw error;

      toast.success(
        status === 'verified' 
          ? t('admin.business_approved', 'Business approved successfully')
          : t('admin.business_rejected', 'Business application rejected')
      );

      fetchBusinessApplications();
      setSelectedBusiness(null);
    } catch (error) {
      console.error('Error moderating business:', error);
      toast.error(t('admin.error_moderating_business', 'Error processing business application'));
    } finally {
      setModerating(null);
    }
  };

  const getDaysOld = (createdAt: string) => {
    return Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
  };

  const getPriorityBadge = (daysOld: number) => {
    if (daysOld > 7) return <Badge variant="destructive" className="text-xs">
      <AlertTriangle className="h-3 w-3 mr-1" />
      {t('priority.urgent', 'Urgent')}
    </Badge>;
    if (daysOld > 3) return <Badge variant="outline" className="text-xs border-yellow-200 text-yellow-800">
      {t('priority.high', 'High')}
    </Badge>;
    return <Badge variant="secondary" className="text-xs">
      {t('priority.normal', 'Normal')}
    </Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('admin.business_approval', 'Business Approval')}
          </h2>
          <p className="text-muted-foreground">
            {t('admin.business_approval_desc', 'Review and approve business verification applications')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-orange-600">
            {applications.length} {t('admin.pending_applications', 'pending applications')}
          </Badge>
          <Button 
            onClick={fetchBusinessApplications} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('button.refresh', 'Refresh')}
          </Button>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : applications.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {t('admin.no_pending_businesses', 'No Pending Business Applications')}
            </h3>
            <p className="text-muted-foreground">
              {t('admin.all_businesses_reviewed', 'All business applications have been reviewed')}
            </p>
          </div>
        ) : (
          applications.map((business) => (
            <Card key={business.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={business.logo_url} />
                      <AvatarFallback>
                        <Building className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{business.name}</CardTitle>
                      <CardDescription>{business.category}</CardDescription>
                    </div>
                  </div>
                  {getPriorityBadge(getDaysOld(business.created_at))}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {business.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{business.location}</span>
                  </div>
                  
                  {business.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{business.phone}</span>
                    </div>
                  )}
                  
                  {business.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{business.website}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {business.template_enabled && (
                    <Badge variant="secondary" className="text-xs">
                      {t('business.template_enabled', 'Template Enabled')}
                    </Badge>
                  )}
                  {business.payment_enabled && (
                    <Badge variant="secondary" className="text-xs">
                      {t('business.payment_enabled', 'Payments')}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">
                    {getDaysOld(business.created_at)} {t('time.days_ago', 'days ago')}
                  </span>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          {t('button.review', 'Review')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {t('admin.business_review', 'Business Application Review')}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={business.logo_url} />
                              <AvatarFallback>
                                <Building className="h-8 w-8" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-bold">{business.name}</h3>
                              <p className="text-muted-foreground">{business.category}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={business.profiles?.avatar_url} />
                                  <AvatarFallback className="text-xs">
                                    {business.profiles?.name?.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{business.profiles?.name}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">{t('business.description', 'Description')}</h4>
                            <div className="bg-muted p-4 rounded-lg">
                              <p className="text-sm">{business.description}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">{t('business.contact_info', 'Contact Information')}</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{business.location}</span>
                                </div>
                                {business.phone && (
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4" />
                                    <span>{business.phone}</span>
                                  </div>
                                )}
                                {business.website && (
                                  <div className="flex items-center space-x-2">
                                    <Globe className="h-4 w-4" />
                                    <span>{business.website}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">{t('business.features', 'Features')}</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">{t('business.template_enabled', 'Website Template')}</span>
                                  {business.template_enabled ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">{t('business.payment_enabled', 'Payment Processing')}</span>
                                  {business.payment_enabled ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {business.verification_documents && (
                            <div>
                              <h4 className="font-medium mb-2">{t('business.verification_documents', 'Verification Documents')}</h4>
                              <div className="bg-muted p-4 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4" />
                                  <span className="text-sm">{t('business.documents_provided', 'Documents provided for verification')}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end space-x-2 pt-4 border-t">
                            <Button
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => moderateBusiness(business.id, 'rejected')}
                              disabled={moderating === business.id}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              {t('button.reject', 'Reject')}
                            </Button>
                            <Button
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => moderateBusiness(business.id, 'verified')}
                              disabled={moderating === business.id}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {t('button.approve', 'Approve')}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};