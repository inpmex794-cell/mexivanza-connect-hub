import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, TrendingUp, Award } from "lucide-react";

export const Companies: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Building2,
      title: t("companies.incorporation", "Business Incorporation"),
      description: t("companies.incorporation_desc", "Complete legal setup for your Mexican business entity"),
      features: [
        t("companies.feature_1", "Legal documentation"),
        t("companies.feature_2", "Tax registration"),
        t("companies.feature_3", "Banking assistance")
      ]
    },
    {
      icon: Users,
      title: t("companies.consulting", "Business Consulting"),
      description: t("companies.consulting_desc", "Strategic guidance for market entry and expansion"),
      features: [
        t("companies.feature_4", "Market analysis"),
        t("companies.feature_5", "Strategic planning"),
        t("companies.feature_6", "Partnership facilitation")
      ]
    },
    {
      icon: TrendingUp,
      title: t("companies.growth", "Growth Services"),
      description: t("companies.growth_desc", "Digital transformation and scaling solutions"),
      features: [
        t("companies.feature_7", "Digital marketing"),
        t("companies.feature_8", "E-commerce setup"),
        t("companies.feature_9", "Technology integration")
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground mb-6">
              {t("companies.title", "Business Solutions")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              {t("companies.subtitle", "Comprehensive services to establish, grow, and scale your business in Mexico")}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <service.icon className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                  <p className="text-muted-foreground">
                    {service.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">
                    {t("companies.learn_more", "Learn More")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("companies.cta_title", "Ready to Start Your Business?")}
            </h2>
            <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
              {t("companies.cta_content", "Get expert guidance and comprehensive support for your business journey in Mexico.")}
            </p>
            <Button size="lg" className="px-8">
              {t("companies.get_started", "Get Started")}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};