import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { TravelWhatsAppButton, LegalWhatsAppButton, DigitalWhatsAppButton } from "@/components/ui/whatsapp-button";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const footerSections = [
    {
      title: t("nav.travel"),
      links: [
        { name: "Cancún", href: "/travel/quintana-roo/cancun" },
        { name: "CDMX", href: "/travel/cdmx/mexico-city" },
        { name: "Guadalajara", href: "/travel/jalisco/guadalajara" },
        { name: "Playa del Carmen", href: "/travel/quintana-roo/playa-del-carmen" },
      ],
    },
    {
      title: t("nav.legal"),
      links: [
        { name: t("footer.legal.incorporation", "Constitución de Empresas"), href: "/legal/incorporation" },
        { name: t("footer.legal.immigration", "Derecho Migratorio"), href: "/legal/immigration" },
        { name: t("footer.legal.real_estate", "Bienes Raíces"), href: "/legal/real-estate" },
        { name: t("footer.legal.tax", "Derecho Fiscal"), href: "/legal/tax" },
      ],
    },
    {
      title: t("nav.digital"),
      links: [
        { name: t("footer.digital.web_dev", "Desarrollo Web"), href: "/digital/web-development" },
        { name: t("footer.digital.marketing", "Marketing Digital"), href: "/digital/marketing" },
        { name: t("footer.digital.ecommerce", "E-commerce"), href: "/digital/ecommerce" },
        { name: t("footer.digital.consulting", "Consultoría Tech"), href: "/digital/consulting" },
      ],
    },
  ];

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-hero"></div>
              <span className="text-xl font-bold">Mexivanza</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col space-y-2">
              <TravelWhatsAppButton />
              <LegalWhatsAppButton />
              <DigitalWhatsAppButton />
            </div>
          </div>

          {/* Service Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            {t("footer.copyright", "© 2024 Mexivanza. Todos los derechos reservados.")}
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary text-sm">
              {t("footer.privacy", "Política de Privacidad")}
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary text-sm">
              {t("footer.terms", "Términos de Servicio")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};