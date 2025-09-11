import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Users } from "lucide-react";

export const Careers: React.FC = () => {
  const { t } = useLanguage();

  const openings = [
    {
      title: t("careers.frontend_dev", "Frontend Developer"),
      department: t("careers.tech", "Technology"),
      location: "Ciudad de México",
      type: t("careers.full_time", "Full-time"),
      salary: "$40,000 - $60,000 MXN",
      description: t("careers.frontend_desc", "Build amazing user experiences with React and modern web technologies")
    },
    {
      title: t("careers.legal_advisor", "Legal Advisor"),
      department: t("careers.legal", "Legal"),
      location: "Remote",
      type: t("careers.full_time", "Full-time"),
      salary: "$50,000 - $70,000 MXN",
      description: t("careers.legal_desc", "Provide expert legal guidance for corporate and immigration matters")
    },
    {
      title: t("careers.travel_coord", "Travel Coordinator"),
      department: t("careers.travel", "Travel"),
      location: "Cancún",
      type: t("careers.part_time", "Part-time"),
      salary: "$25,000 - $35,000 MXN",
      description: t("careers.travel_desc", "Coordinate and manage travel experiences for our clients")
    }
  ];

  const benefits = [
    t("careers.benefit_1", "Competitive salary"),
    t("careers.benefit_2", "Health insurance"),
    t("careers.benefit_3", "Remote work options"),
    t("careers.benefit_4", "Professional development"),
    t("careers.benefit_5", "Flexible schedule"),
    t("careers.benefit_6", "Travel opportunities")
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground mb-6">
              {t("careers.title", "Join Our Team")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              {t("careers.subtitle", "Be part of a dynamic team transforming business in Mexico. We're looking for passionate professionals to join our mission.")}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {t("careers.open_positions", "Open Positions")}
              </h2>
              
              {openings.map((job, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                        <Badge variant="secondary">{job.department}</Badge>
                      </div>
                      <Button>{t("careers.apply", "Apply")}</Button>
                    </div>
                    <p className="text-muted-foreground">{job.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span>{job.salary}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t("careers.benefits", "Benefits & Perks")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("careers.culture", "Our Culture")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t("careers.culture_desc", "We believe in innovation, collaboration, and creating meaningful impact. Join a team where your ideas matter and your growth is supported.")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("careers.no_match", "Don't See a Perfect Match?")}
            </h2>
            <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
              {t("careers.no_match_desc", "We're always looking for talented individuals. Send us your resume and let us know how you'd like to contribute.")}
            </p>
            <Button size="lg" className="px-8">
              {t("careers.send_resume", "Send Resume")}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};