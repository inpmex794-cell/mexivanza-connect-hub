import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Scale, FileText, CheckCircle } from "lucide-react";

export const TrademarkRegistrationModule: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    trademark_name: "",
    description: "",
    usage_scenario: "",
    applicant_name: "",
    applicant_email: "",
    applicant_phone: "",
    applicant_address: "",
    selected_classes: [] as string[]
  });

  const trademarkClasses = [
    { id: "1", name: "Químicos", description: "Productos químicos para la industria" },
    { id: "3", name: "Cosméticos", description: "Cosméticos y productos de limpieza" },
    { id: "9", name: "Electrónicos", description: "Aparatos e instrumentos científicos" },
    { id: "25", name: "Vestimenta", description: "Vestimenta, calzado y sombreros" },
    { id: "29", name: "Alimentos", description: "Carne, pescado, aves y productos lácteos" },
    { id: "35", name: "Publicidad", description: "Publicidad y gestión de negocios" },
    { id: "41", name: "Educación", description: "Educación y entretenimiento" },
    { id: "42", name: "Tecnología", description: "Servicios científicos y tecnológicos" }
  ];

  const handleClassToggle = (classId: string) => {
    setFormData(prev => ({
      ...prev,
      selected_classes: prev.selected_classes.includes(classId)
        ? prev.selected_classes.filter(id => id !== classId)
        : [...prev.selected_classes, classId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Debes iniciar sesión para registrar una marca");
      return;
    }

    if (formData.selected_classes.length === 0) {
      toast.error(t("form.select_option", "Selecciona al menos una clase de marca"));
      return;
    }

    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('trademark_applications')
        .insert([{
          user_id: user.id,
          applicant_info: {
            name: formData.applicant_name,
            email: formData.applicant_email,
            phone: formData.applicant_phone,
            address: formData.applicant_address
          },
          description: formData.description,
          usage_scenario: formData.usage_scenario,
          trademark_class: formData.selected_classes,
          status: 'pending',
          payment_status: 'unpaid'
        }]);

      if (error) throw error;

      toast.success("Solicitud de marca registrada exitosamente");
      setStep(3);
    } catch (error) {
      console.error('Error submitting trademark application:', error);
      toast.error("Error al enviar la solicitud");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 3) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">¡Solicitud Enviada!</h3>
          <p className="text-muted-foreground mb-6">
            Tu solicitud de registro de marca ha sido enviada exitosamente. 
            Recibirás una confirmación por email y un especialista se pondrá en contacto contigo.
          </p>
          <Button onClick={() => {
            setStep(1);
            setFormData({
              trademark_name: "",
              description: "",
              usage_scenario: "",
              applicant_name: "",
              applicant_email: "",
              applicant_phone: "",
              applicant_address: "",
              selected_classes: []
            });
          }}>
            Nueva Solicitud
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Registro de Marca Comercial
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className={`px-2 py-1 rounded ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            1. Información
          </span>
          <span className={`px-2 py-1 rounded ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            2. Clases
          </span>
          <span className={`px-2 py-1 rounded ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            3. Confirmar
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trademark_name">{t("form.name", "Nombre")} de la Marca</Label>
                <Input
                  id="trademark_name"
                  value={formData.trademark_name}
                  onChange={(e) => setFormData({ ...formData, trademark_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="applicant_name">{t("form.name", "Nombre")} del Solicitante</Label>
                <Input
                  id="applicant_name"
                  value={formData.applicant_name}
                  onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="applicant_email">{t("form.email", "Email")}</Label>
                <Input
                  id="applicant_email"
                  type="email"
                  value={formData.applicant_email}
                  onChange={(e) => setFormData({ ...formData, applicant_email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="applicant_phone">{t("form.phone", "Teléfono")}</Label>
                <Input
                  id="applicant_phone"
                  value={formData.applicant_phone}
                  onChange={(e) => setFormData({ ...formData, applicant_phone: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="applicant_address">Dirección Completa</Label>
              <Textarea
                id="applicant_address"
                value={formData.applicant_address}
                onChange={(e) => setFormData({ ...formData, applicant_address: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Descripción de la Marca</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe tu marca, productos o servicios..."
                required
              />
            </div>
            
            <div>
              <Label htmlFor="usage_scenario">Escenario de Uso</Label>
              <Textarea
                id="usage_scenario"
                value={formData.usage_scenario}
                onChange={(e) => setFormData({ ...formData, usage_scenario: e.target.value })}
                placeholder="¿Cómo planeas usar esta marca?"
                required
              />
            </div>
            
            <Button type="submit" className="w-full">
              Continuar a Clases
            </Button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">{t("form.select", "Selecciona")} las Clases de Marca</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Elige las categorías que mejor describan tus productos o servicios.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trademarkClasses.map((tmClass) => (
                <div key={tmClass.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={tmClass.id}
                    checked={formData.selected_classes.includes(tmClass.id)}
                    onCheckedChange={() => handleClassToggle(tmClass.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={tmClass.id} className="font-medium">
                      Clase {tmClass.id}: {tmClass.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{tmClass.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Volver
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={formData.selected_classes.length === 0 || submitting}
                className="flex-1"
              >
                {submitting ? "Enviando..." : "Enviar Solicitud"}
                <FileText className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};