import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { TravelWhatsAppButton, LegalWhatsAppButton, DigitalWhatsAppButton } from "@/components/ui/whatsapp-button";
import { MapPin, Scale, Smartphone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-mexico.jpg";

export const Home: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: MapPin,
      titleKey: "nav.travel",
      description: "Descubre destinos únicos en México con nuestros paquetes personalizados",
      link: "/travel",
      button: TravelWhatsAppButton,
      variant: "ocean" as const,
    },
    {
      icon: Scale,
      titleKey: "nav.legal",
      description: "Servicios legales especializados para empresas y particulares",
      link: "/legal",
      button: LegalWhatsAppButton,
      variant: "earth" as const,
    },
    {
      icon: Smartphone,
      titleKey: "nav.digital",
      description: "Soluciones digitales innovadoras para impulsar tu negocio",
      link: "/digital",
      button: DigitalWhatsAppButton,
      variant: "sunset" as const,
    },
  ];

  const regions = [
    {
      name: t("region.north"),
      states: ["Nuevo León", "Chihuahua", "Coahuila"],
      link: "/regions/north",
      gradient: "bg-gradient-earth",
    },
    {
      name: t("region.pacific"),
      states: ["Jalisco", "Nayarit", "Sinaloa"],
      link: "/regions/pacific", 
      gradient: "bg-gradient-ocean",
    },
    {
      name: t("region.central"),
      states: ["CDMX", "Estado de México", "Puebla"],
      link: "/regions/central",
      gradient: "bg-gradient-hero",
    },
    {
      name: t("region.southeast"),
      states: ["Quintana Roo", "Yucatán", "Campeche"],
      link: "/regions/southeast",
      gradient: "bg-gradient-sunset",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-20 md:py-32 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero/80"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            {t("hero.subtitle")}
          </p>
          <Button variant="secondary" size="xl" className="shadow-glow">
            {t("hero.cta")} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Nuestros Servicios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              const WhatsAppButton = service.button;
              return (
                <Card key={index} className="group hover:shadow-medium transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{t(service.titleKey)}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Link to={service.link}>
                      <Button variant={service.variant} className="w-full">
                        Explorar {t(service.titleKey)}
                      </Button>
                    </Link>
                    <WhatsAppButton className="w-full" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Regions Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Explora México por Regiones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regions.map((region, index) => (
              <Link key={index} to={region.link}>
                <Card className="group hover:shadow-medium transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden">
                  <div className={`h-32 ${region.gradient} relative`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-xl font-bold text-white">{region.name}</h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {region.states.map((state) => (
                        <span
                          key={state}
                          className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
                        >
                          {state}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};