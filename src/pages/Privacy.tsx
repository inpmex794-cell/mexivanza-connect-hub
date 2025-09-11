import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Users } from "lucide-react";

export const Privacy: React.FC = () => {
  const { t } = useLanguage();

  const sections = [
    {
      icon: Shield,
      title: t("privacy.data_protection", "Data Protection"),
      content: t("privacy.data_protection_content", "We protect your personal information with industry-standard security measures.")
    },
    {
      icon: Eye,
      title: t("privacy.data_collection", "Data Collection"),
      content: t("privacy.data_collection_content", "We only collect necessary information to provide our services effectively.")
    },
    {
      icon: Lock,
      title: t("privacy.data_security", "Data Security"),
      content: t("privacy.data_security_content", "Your data is encrypted and stored securely in compliance with international standards.")
    },
    {
      icon: Users,
      title: t("privacy.data_sharing", "Data Sharing"),
      content: t("privacy.data_sharing_content", "We never sell your personal information to third parties.")
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t("privacy.title", "Privacy Policy")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("privacy.subtitle", "Your privacy is our priority. Learn how we protect and handle your information.")}
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
              <CardTitle>{t("privacy.contact_title", "Contact Us")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("privacy.contact_content", "If you have questions about this Privacy Policy, please contact us at")} 
                <a href="mailto:privacy@mexivanza.com" className="text-primary hover:underline ml-1">
                  privacy@mexivanza.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};