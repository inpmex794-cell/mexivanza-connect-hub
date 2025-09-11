import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/use-language';
import { 
  CreditCard, 
  DollarSign, 
  Settings, 
  Shield,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentGateway {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  apiKey?: string;
  secretKey?: string;
  webhookUrl?: string;
  testMode: boolean;
}

export const PaymentSettings: React.FC = () => {
  const { t } = useLanguage();
  const [gateways, setGateways] = useState<PaymentGateway[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      status: 'inactive',
      testMode: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      status: 'inactive',
      testMode: true
    }
  ]);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [commissionSettings, setCommissionSettings] = useState({
    platformFee: 5,
    processingFee: 2.9,
    minimumPayout: 25,
    payoutSchedule: 'weekly'
  });

  const toggleKeyVisibility = (gatewayId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [gatewayId]: !prev[gatewayId]
    }));
  };

  const updateGateway = async (gatewayId: string, updates: Partial<PaymentGateway>) => {
    try {
      setSaving(gatewayId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGateways(prev => prev.map(gateway => 
        gateway.id === gatewayId 
          ? { ...gateway, ...updates }
          : gateway
      ));
      
      toast.success(t('admin.payment_gateway_updated', 'Payment gateway settings updated'));
    } catch (error) {
      toast.error(t('admin.error_updating_gateway', 'Error updating payment gateway'));
    } finally {
      setSaving(null);
    }
  };

  const testConnection = async (gatewayId: string) => {
    try {
      setSaving(gatewayId);
      
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const gateway = gateways.find(g => g.id === gatewayId);
      if (gateway?.apiKey && gateway?.secretKey) {
        toast.success(t('admin.connection_successful', 'Connection test successful'));
      } else {
        toast.error(t('admin.connection_failed', 'Connection test failed - check credentials'));
      }
    } catch (error) {
      toast.error(t('admin.connection_error', 'Error testing connection'));
    } finally {
      setSaving(null);
    }
  };

  const getGatewayStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        {t('status.active', 'Active')}
      </Badge>
    ) : (
      <Badge variant="secondary">
        <AlertTriangle className="h-3 w-3 mr-1" />
        {t('status.inactive', 'Inactive')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('admin.payment_settings', 'Payment Settings')}
          </h2>
          <p className="text-muted-foreground">
            {t('admin.payment_settings_desc', 'Configure payment gateways and commission structure')}
          </p>
        </div>
      </div>

      <Tabs defaultValue="gateways" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gateways" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>{t('admin.payment_gateways', 'Payment Gateways')}</span>
          </TabsTrigger>
          <TabsTrigger value="commission" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>{t('admin.commission_settings', 'Commission Settings')}</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>{t('admin.security', 'Security')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gateways" className="space-y-4">
          {gateways.map((gateway) => (
            <Card key={gateway.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle>{gateway.name}</CardTitle>
                      <CardDescription>
                        {gateway.id === 'stripe' 
                          ? t('admin.stripe_desc', 'Accept credit cards and digital payments')
                          : t('admin.paypal_desc', 'Accept PayPal and credit card payments')
                        }
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getGatewayStatusBadge(gateway.status)}
                    {gateway.testMode && (
                      <Badge variant="outline" className="text-orange-600">
                        {t('mode.test', 'Test Mode')}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${gateway.id}-api-key`}>
                      {t('admin.api_key', 'API Key')}
                    </Label>
                    <div className="relative">
                      <Input
                        id={`${gateway.id}-api-key`}
                        type={showKeys[gateway.id] ? 'text' : 'password'}
                        value={gateway.apiKey || ''}
                        onChange={(e) => updateGateway(gateway.id, { apiKey: e.target.value })}
                        placeholder={gateway.id === 'stripe' ? 'pk_...' : 'client_id_...'}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleKeyVisibility(gateway.id)}
                      >
                        {showKeys[gateway.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${gateway.id}-secret-key`}>
                      {t('admin.secret_key', 'Secret Key')}
                    </Label>
                    <div className="relative">
                      <Input
                        id={`${gateway.id}-secret-key`}
                        type={showKeys[`${gateway.id}-secret`] ? 'text' : 'password'}
                        value={gateway.secretKey || ''}
                        onChange={(e) => updateGateway(gateway.id, { secretKey: e.target.value })}
                        placeholder={gateway.id === 'stripe' ? 'sk_...' : 'client_secret_...'}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => toggleKeyVisibility(`${gateway.id}-secret`)}
                      >
                        {showKeys[`${gateway.id}-secret`] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${gateway.id}-webhook`}>
                    {t('admin.webhook_url', 'Webhook URL')}
                  </Label>
                  <Input
                    id={`${gateway.id}-webhook`}
                    value={gateway.webhookUrl || ''}
                    onChange={(e) => updateGateway(gateway.id, { webhookUrl: e.target.value })}
                    placeholder="https://your-domain.com/webhook"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`${gateway.id}-test-mode`}
                        checked={gateway.testMode}
                        onCheckedChange={(checked) => updateGateway(gateway.id, { testMode: checked })}
                      />
                      <Label htmlFor={`${gateway.id}-test-mode`}>
                        {t('admin.test_mode', 'Test Mode')}
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`${gateway.id}-status`}
                        checked={gateway.status === 'active'}
                        onCheckedChange={(checked) => 
                          updateGateway(gateway.id, { status: checked ? 'active' : 'inactive' })
                        }
                      />
                      <Label htmlFor={`${gateway.id}-status`}>
                        {t('admin.enable_gateway', 'Enable Gateway')}
                      </Label>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testConnection(gateway.id)}
                      disabled={saving === gateway.id}
                    >
                      {saving === gateway.id ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      {t('button.test_connection', 'Test Connection')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="commission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                {t('admin.commission_structure', 'Commission Structure')}
              </CardTitle>
              <CardDescription>
                {t('admin.commission_desc', 'Configure platform fees and payout settings')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platform-fee">
                    {t('admin.platform_fee', 'Platform Fee')} (%)
                  </Label>
                  <Input
                    id="platform-fee"
                    type="number"
                    value={commissionSettings.platformFee}
                    onChange={(e) => setCommissionSettings(prev => ({
                      ...prev,
                      platformFee: Number(e.target.value)
                    }))}
                    min="0"
                    max="50"
                    step="0.1"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('admin.platform_fee_desc', 'Percentage taken from each transaction')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="processing-fee">
                    {t('admin.processing_fee', 'Processing Fee')} (%)
                  </Label>
                  <Input
                    id="processing-fee"
                    type="number"
                    value={commissionSettings.processingFee}
                    onChange={(e) => setCommissionSettings(prev => ({
                      ...prev,
                      processingFee: Number(e.target.value)
                    }))}
                    min="0"
                    max="10"
                    step="0.1"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('admin.processing_fee_desc', 'Payment gateway processing fee')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimum-payout">
                    {t('admin.minimum_payout', 'Minimum Payout')} ($)
                  </Label>
                  <Input
                    id="minimum-payout"
                    type="number"
                    value={commissionSettings.minimumPayout}
                    onChange={(e) => setCommissionSettings(prev => ({
                      ...prev,
                      minimumPayout: Number(e.target.value)
                    }))}
                    min="10"
                    max="1000"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('admin.minimum_payout_desc', 'Minimum amount required for payout')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payout-schedule">
                    {t('admin.payout_schedule', 'Payout Schedule')}
                  </Label>
                  <select
                    id="payout-schedule"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={commissionSettings.payoutSchedule}
                    onChange={(e) => setCommissionSettings(prev => ({
                      ...prev,
                      payoutSchedule: e.target.value
                    }))}
                  >
                    <option value="daily">{t('schedule.daily', 'Daily')}</option>
                    <option value="weekly">{t('schedule.weekly', 'Weekly')}</option>
                    <option value="monthly">{t('schedule.monthly', 'Monthly')}</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    {t('admin.payout_schedule_desc', 'How often payouts are processed')}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => toast.success(t('admin.commission_updated', 'Commission settings updated'))}>
                  <Settings className="h-4 w-4 mr-2" />
                  {t('button.save_changes', 'Save Changes')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                {t('admin.payment_security', 'Payment Security')}
              </CardTitle>
              <CardDescription>
                {t('admin.security_desc', 'Security settings for payment processing')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('admin.ssl_encryption', 'SSL Encryption')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('admin.ssl_desc', 'Encrypt all payment data in transit')}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {t('status.enabled', 'Enabled')}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('admin.pci_compliance', 'PCI DSS Compliance')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('admin.pci_desc', 'Payment Card Industry compliance status')}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {t('status.compliant', 'Compliant')}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('admin.fraud_detection', 'Fraud Detection')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('admin.fraud_desc', 'Automatic fraud detection and prevention')}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('admin.two_factor_auth', 'Two-Factor Authentication')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('admin.2fa_desc', 'Require 2FA for payment settings changes')}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};