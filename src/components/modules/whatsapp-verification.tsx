import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Shield, Check, AlertCircle, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WhatsAppVerificationProps {
  onVerificationComplete?: () => void;
}

export const WhatsAppVerification: React.FC<WhatsAppVerificationProps> = ({ 
  onVerificationComplete 
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code' | 'verified'>('phone');
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const sendVerificationCode = async () => {
    if (!phoneNumber.trim()) {
      toast.error(t('verification.phone_required', 'Número de teléfono requerido'));
      return;
    }

    setLoading(true);
    try {
      // In real implementation, this would generate and send a code via WhatsApp API
      // For demo, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStep('code');
      toast.success(t('verification.code_sent', 'Código enviado por WhatsApp'));
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast.error(t('verification.send_error', 'Error al enviar código'));
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode.trim()) {
      toast.error(t('verification.code_required', 'Código de verificación requerido'));
      return;
    }

    setLoading(true);
    try {
      // In real implementation, verify the code
      // For demo, accept "123456" as valid code
      if (verificationCode === '123456') {
        setStep('verified');
        setIsVerified(true);
        toast.success(t('verification.success', 'WhatsApp verificado exitosamente'));
        onVerificationComplete?.();
      } else {
        toast.error(t('verification.invalid_code', 'Código inválido'));
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error(t('verification.verify_error', 'Error al verificar código'));
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verified' || isVerified) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-success" />
            {t('verification.whatsapp_verified', 'WhatsApp Verificado')}
          </CardTitle>
          <CardDescription>
            {t('verification.verification_complete', 'Tu número de WhatsApp ha sido verificado exitosamente')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-success/10 text-success">
              <Shield className="h-3 w-3 mr-1" />
              {t('verification.verified', 'Verificado')}
            </Badge>
            <span className="text-sm text-muted-foreground">{phoneNumber}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[#25D366]" />
          {t('verification.whatsapp_title', 'Verificación WhatsApp')}
        </CardTitle>
        <CardDescription>
          {step === 'phone' 
            ? t('verification.phone_description', 'Verifica tu número para habilitar funciones premium')
            : t('verification.code_description', 'Ingresa el código enviado a tu WhatsApp')
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'phone' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('form.phone_number', 'Número de teléfono')}
              </label>
              <div className="flex gap-2">
                <Input
                  type="tel"
                  placeholder="+52 123 456 7890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={sendVerificationCode} disabled={loading}>
                  <Phone className="h-4 w-4 mr-2" />
                  {loading ? t('button.sending', 'Enviando...') : t('button.send_code', 'Enviar')}
                </Button>
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium mb-1">
                    {t('verification.note_title', 'Nota importante:')}
                  </p>
                  <p className="text-muted-foreground">
                    {t('verification.note_description', 'El código será enviado vía WhatsApp. Asegúrate de que el número sea correcto.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'code' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('form.verification_code', 'Código de verificación')}
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="flex-1 text-center text-lg tracking-widest"
                />
                <Button onClick={verifyCode} disabled={loading}>
                  <Check className="h-4 w-4 mr-2" />
                  {loading ? t('button.verifying', 'Verificando...') : t('button.verify', 'Verificar')}
                </Button>
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {t('verification.demo_code', 'Para demo, usa el código: 123456')}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={sendVerificationCode} 
                className="mt-2"
                disabled={loading}
              >
                {t('button.resend_code', 'Reenviar código')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};