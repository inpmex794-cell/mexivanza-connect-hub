import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, Download, Eye, Gavel } from "lucide-react";

interface LegalTemplate {
  id: string;
  template_name: string;
  template_type: string;
  variables: any;
  is_active: boolean;
}

export const LegalDocumentGeneratorModule: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [templates, setTemplates] = useState<LegalTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<LegalTemplate | null>(null);
  const [formData, setFormData] = useState<{[key: string]: string}>({});
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_templates')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      // Initialize form data with template variables
      const initialData: {[key: string]: string} = {};
      if (template.variables) {
        Object.keys(template.variables).forEach(key => {
          initialData[key] = "";
        });
      }
      setFormData(initialData);
      setPreview("");
    }
  };

  const generatePreview = () => {
    if (!selectedTemplate) return;
    
    let content = selectedTemplate.template_name === "Contrato de Servicios" ? 
      getServiceContractTemplate() : 
      selectedTemplate.template_name === "Poder Notarial" ?
      getPowerOfAttorneyTemplate() :
      getGenericTemplate();

    // Replace variables in template
    Object.entries(formData).forEach(([key, value]) => {
      content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || `[${key}]`);
    });

    setPreview(content);
  };

  const handleGenerate = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para generar documentos");
      return;
    }

    if (!selectedTemplate) {
      toast.error(t("form.select_option", "Selecciona un template"));
      return;
    }

    setGenerating(true);
    
    try {
      const { error } = await supabase
        .from('generated_documents')
        .insert([{
          user_id: user.id,
          template_id: selectedTemplate.id,
          document_data: formData,
          language: language
        }]);

      if (error) throw error;

      toast.success("Documento generado exitosamente");
      generatePreview();
    } catch (error) {
      console.error('Error generating document:', error);
      toast.error("Error al generar el documento");
    } finally {
      setGenerating(false);
    }
  };

  const getServiceContractTemplate = () => {
    return `
CONTRATO DE PRESTACIÓN DE SERVICIOS

Entre {{client_name}}, en adelante "EL CLIENTE", y {{provider_name}}, en adelante "EL PROVEEDOR", se celebra el presente contrato bajo los siguientes términos:

1. OBJETO DEL CONTRATO
EL PROVEEDOR se compromete a prestar los siguientes servicios: {{service_description}}

2. DURACIÓN
El presente contrato tendrá vigencia desde {{start_date}} hasta {{end_date}}.

3. CONTRAPRESTACIÓN
EL CLIENTE pagará la cantidad de {{amount}} {{currency}} por los servicios prestados.

4. FORMA DE PAGO
El pago se realizará {{payment_terms}}.

5. OBLIGACIONES DEL PROVEEDOR
- Prestar los servicios con la calidad acordada
- Cumplir con los plazos establecidos
- {{additional_obligations}}

6. OBLIGACIONES DEL CLIENTE
- Pagar puntualmente la contraprestación acordada
- Proporcionar la información necesaria para la prestación del servicio
- {{client_obligations}}

Firmado en {{location}} el {{date}}.

_____________________        _____________________
{{client_name}}               {{provider_name}}
EL CLIENTE                    EL PROVEEDOR
`;
  };

  const getPowerOfAttorneyTemplate = () => {
    return `
PODER NOTARIAL

Yo, {{grantor_name}}, mayor de edad, con domicilio en {{grantor_address}}, por medio del presente otorgo PODER AMPLIO Y SUFICIENTE a {{attorney_name}}, mayor de edad, con domicilio en {{attorney_address}}, para que a mi nombre y representación realice los siguientes actos:

{{powers_granted}}

Este poder se otorga por el término de {{duration}} y podrá ser revocado en cualquier momento mediante notificación escrita.

Las facultades aquí conferidas incluyen:
- {{specific_power_1}}
- {{specific_power_2}}
- {{specific_power_3}}

Dado en {{location}} a los {{day}} días del mes de {{month}} del año {{year}}.

_____________________
{{grantor_name}}
OTORGANTE

_____________________
{{attorney_name}}
APODERADO
`;
  };

  const getGenericTemplate = () => {
    return `
DOCUMENTO LEGAL

{{document_title}}

{{document_content}}

Firmado en {{location}} el {{date}}.

_____________________
{{signatory_name}}
`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            {t("legal.documents", "Legal Document Generator")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>{t("legal.select_template", "Select a Template")}</Label>
              <Select onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder={t("legal.select_template_placeholder", "Choose document type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service-contract">{t("legal.service_contract", "Service Contract")}</SelectItem>
                  <SelectItem value="power-attorney">{t("legal.power_attorney", "Power of Attorney")}</SelectItem>
                  <SelectItem value="nda">{t("legal.nda", "Confidentiality Agreement")}</SelectItem>
                  <SelectItem value="employment">{t("legal.employment", "Employment Contract")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedTemplate && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedTemplate.template_name === "Contrato de Servicios" && (
                  <>
                    <div>
                      <Label htmlFor="client_name">{t("legal.client_name", "Client Name")}</Label>
                      <Input
                        id="client_name"
                        value={formData.client_name || ""}
                        onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="provider_name">{t("legal.provider_name", "Provider Name")}</Label>
                      <Input
                        id="provider_name"
                        value={formData.provider_name || ""}
                        onChange={(e) => setFormData({...formData, provider_name: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="service_description">{t("legal.service_description", "Service Description")}</Label>
                      <Textarea
                        id="service_description"
                        value={formData.service_description || ""}
                        onChange={(e) => setFormData({...formData, service_description: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">{t("legal.amount", "Amount")}</Label>
                      <Input
                        id="amount"
                        value={formData.amount || ""}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">{t("legal.currency", "Currency")}</Label>
                      <Input
                        id="currency"
                        value={formData.currency || "MXN"}
                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="start_date">{t("legal.start_date", "Start Date")}</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={formData.start_date || ""}
                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_date">{t("legal.end_date", "End Date")}</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={formData.end_date || ""}
                        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      />
                    </div>
                  </>
                )}

                {selectedTemplate.template_name === "Poder Notarial" && (
                  <>
                    <div>
                      <Label htmlFor="grantor_name">{t("legal.grantor_name", "Grantor Name")}</Label>
                      <Input
                        id="grantor_name"
                        value={formData.grantor_name || ""}
                        onChange={(e) => setFormData({...formData, grantor_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="attorney_name">{t("legal.attorney_name", "Attorney Name")}</Label>
                      <Input
                        id="attorney_name"
                        value={formData.attorney_name || ""}
                        onChange={(e) => setFormData({...formData, attorney_name: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="powers_granted">{t("legal.powers_granted", "Powers Granted")}</Label>
                      <Textarea
                        id="powers_granted"
                        value={formData.powers_granted || ""}
                        onChange={(e) => setFormData({...formData, powers_granted: e.target.value})}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <Button onClick={generatePreview} disabled={!selectedTemplate}>
                <Eye className="mr-2 h-4 w-4" />
                {t("legal.preview", "Preview")}
              </Button>
              <Button onClick={handleGenerate} disabled={generating || !selectedTemplate}>
                {generating ? t("legal.generating", "Generating...") : t("legal.generate", "Generate Document")}
                <FileText className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {preview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {t("legal.preview_title", "Document Preview")}
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                {t("legal.download_pdf", "Download PDF")}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-6 border rounded-lg">
              <pre className="whitespace-pre-wrap font-mono text-sm">{preview}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};