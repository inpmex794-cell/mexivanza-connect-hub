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
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4 lg:space-y-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-hero flex-shrink-0"></div>
              <span className="text-xl font-bold text-foreground">Mexivanza</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col space-y-3 max-w-xs">
              <TravelWhatsAppButton />
              <LegalWhatsAppButton />
              <DigitalWhatsAppButton />
            </div>
          </div>

          {/* Service Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-foreground text-base">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm leading-relaxed block max-w-full overflow-wrap-anywhere word-break-break-word hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-border mt-8 md:mt-12 pt-6 md:pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-8">
            {/* Copyright */}
            <div className="order-2 lg:order-1">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t("footer.copyright", "© 2024 Mexivanza. All rights reserved.")}
              </p>
            </div>
            
            {/* Legal Links */}
            <nav className="order-1 lg:order-2 w-full lg:w-auto">
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-6 gap-y-3 text-sm">
                <Link 
                  to="/companies" 
                  className="text-muted-foreground hover:text-primary transition-colors hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm overflow-wrap-anywhere word-break-break-word"
                >
                  {t("footer.companies", "Companies")}
                </Link>
                <Link 
                  to="/about" 
                  className="text-muted-foreground hover:text-primary transition-colors hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm overflow-wrap-anywhere word-break-break-word"
                >
                  {t("footer.about", "About")}
                </Link>
                <Link 
                  to="/contact" 
                  className="text-muted-foreground hover:text-primary transition-colors hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm overflow-wrap-anywhere word-break-break-word"
                >
                  {t("footer.contact", "Contact")}
                </Link>
                <Link 
                  to="/careers" 
                  className="text-muted-foreground hover:text-primary transition-colors hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm overflow-wrap-anywhere word-break-break-word"
                >
                  {t("footer.careers", "Careers")}
                </Link>
                <Link 
                  to="/blog" 
                  className="text-muted-foreground hover:text-primary transition-colors hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm overflow-wrap-anywhere word-break-break-word"
                >
                  {t("footer.blog", "Blog")}
                </Link>
                <Link 
                  to="/privacy" 
                  className="text-muted-foreground hover:text-primary transition-colors hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm overflow-wrap-anywhere word-break-break-word"
                >
                  {t("footer.privacy", "Privacy Policy")}
                </Link>
                <Link 
                  to="/terms" 
                  className="text-muted-foreground hover:text-primary transition-colors hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm overflow-wrap-anywhere word-break-break-word"
                >
                  {t("footer.terms", "Terms of Service")}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};