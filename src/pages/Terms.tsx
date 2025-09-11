import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertTriangle, Scale, Gavel } from "lucide-react";

export const Terms: React.FC = () => {
  const { t } = useLanguage();

  const sections = [
    {
      icon: FileText,
      title: t("terms.acceptance", "Acceptance of Terms"),
      content: t("terms.acceptance_content", "By using Mexivanza services, you agree to these terms and conditions.")
    },
    {
      icon: Scale,
      title: t("terms.user_rights", "User Rights & Responsibilities"),
      content: t("terms.user_rights_content", "Users must provide accurate information and use services responsibly.")
    },
    {
      icon: AlertTriangle,
      title: t("terms.prohibited_use", "Prohibited Use"),
      content: t("terms.prohibited_use_content", "Illegal activities, spam, and misuse of services are strictly prohibited.")
    },
    {
      icon: Gavel,
      title: t("terms.dispute_resolution", "Dispute Resolution"),
      content: t("terms.dispute_resolution_content", "Disputes will be resolved through arbitration under Mexican law.")
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t("terms.title", "Terms of Service")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("terms.subtitle", "Please read these terms carefully before using our services.")}
            </p>
          </div>

          <div className="grid gap-6 mb-12">
            {sections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <section.icon className="h-6 w-6 text-primary" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("terms.modifications", "Modifications")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("terms.modifications_content", "We reserve the right to modify these terms. Changes will be posted on this page.")}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};