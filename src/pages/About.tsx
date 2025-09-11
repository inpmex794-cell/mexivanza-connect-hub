import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Globe, Award } from "lucide-react";

export const About: React.FC = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: Target,
      title: t("about.mission", "Our Mission"),
      content: t("about.mission_content", "To simplify business processes and connect opportunities in Mexico through innovative digital solutions.")
    },
    {
      icon: Users,
      title: t("about.team", "Our Team"),
      content: t("about.team_content", "Experienced professionals in travel, legal, and digital services working together for your success.")
    },
    {
      icon: Globe,
      title: t("about.vision", "Our Vision"),
      content: t("about.vision_content", "To be the leading platform connecting Mexican businesses with global opportunities.")
    },
    {
      icon: Award,
      title: t("about.values", "Our Values"),
      content: t("about.values_content", "Transparency, innovation, and commitment to excellence in everything we do.")
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground mb-6">
              {t("about.title", "About Mexivanza")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              {t("about.description", "Mexivanza is a comprehensive platform that bridges the gap between traditional Mexican business practices and modern digital innovation. We provide integrated solutions for travel, legal services, and digital transformation.")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <value.icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("about.join_title", "Join Our Community")}
            </h2>
            <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
              {t("about.join_content", "Become part of a growing network of businesses and professionals transforming Mexico's digital landscape.")}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};