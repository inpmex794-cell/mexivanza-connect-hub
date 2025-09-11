import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Basic translations - can be expanded
const translations = {
  es: {
    "nav.home": "Inicio",
    "nav.travel": "Viajes",
    "nav.legal": "Legal",
    "nav.digital": "Digital",
    "nav.login": "Iniciar Sesión",
    "nav.register": "Registrarse",
    "hero.title": "Servicios Integrales para México",
    "hero.subtitle": "Viajes, servicios legales y soluciones digitales en todo México",
    "hero.cta": "Comenzar Ahora",
    "auth.email": "Correo Electrónico",
    "auth.password": "Contraseña",
    "auth.login": "Iniciar Sesión",
    "auth.register": "Registrarse",
    "auth.forgot": "¿Olvidaste tu contraseña?",
    "whatsapp.travel": "Consulta de Viajes",
    "whatsapp.legal": "Consulta Legal",
    "whatsapp.digital": "Consulta Digital",
    "region.north": "Norte",
    "region.pacific": "Pacífico",
    "region.central": "Centro",
    "region.southeast": "Sureste",
    "dashboard.welcome": "Bienvenido a tu panel",
    "dashboard.logout": "Cerrar Sesión",
    "search.placeholder": "Buscar servicios, regiones...",
    "nav.services": "Servicios",
    "nav.regions": "Regiones",
    "nav.actions": "Acciones Rápidas",
    "nav.dashboard": "Panel",
    "nav.profile": "Perfil",
    "nav.settings": "Configuración",
    "stats.title": "Estadísticas",
    "activity.title": "Actividad Reciente",
    "featured.title": "Servicios Destacados",
    "contact.quick_contact": "Contacto Rápido",
    "contact.schedule": "Programar Llamada",
    "feed.travel_update": "Nuevos Paquetes de Viaje Disponibles",
    "feed.travel_content": "Descubre nuevos destinos increíbles en México con nuestras experiencias de viaje curadas.",
    "feed.legal_tip": "Consejo Legal: Registro de Empresas",
    "feed.legal_content": "Pasos esenciales para registrar tu empresa en México. Nuestros expertos legales te guían.",
    "feed.digital_showcase": "Historia de Éxito en Transformación Digital",
    "feed.digital_content": "Cómo ayudamos a un negocio local a aumentar su presencia online 300% con nuestras soluciones.",
    "action.learn_more": "Saber Más",
    "contact.inquiry": "Consulta",
  },
  en: {
    "nav.home": "Home",
    "nav.travel": "Travel",
    "nav.legal": "Legal",
    "nav.digital": "Digital", 
    "nav.login": "Login",
    "nav.register": "Sign Up",
    "hero.title": "Comprehensive Services for Mexico",
    "hero.subtitle": "Travel, legal services and digital solutions across Mexico",
    "hero.cta": "Get Started",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.login": "Login",
    "auth.register": "Sign Up",
    "auth.forgot": "Forgot your password?",
    "whatsapp.travel": "Travel Inquiry",
    "whatsapp.legal": "Legal Consultation",
    "whatsapp.digital": "Digital Consultation",
    "region.north": "North",
    "region.pacific": "Pacific",
    "region.central": "Central",
    "region.southeast": "Southeast",
    "dashboard.welcome": "Welcome to your dashboard",
    "dashboard.logout": "Logout",
    "search.placeholder": "Search services, regions...",
    "nav.services": "Services",
    "nav.regions": "Regions", 
    "nav.actions": "Quick Actions",
    "nav.dashboard": "Dashboard",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "stats.title": "Quick Stats",
    "activity.title": "Recent Activity",
    "featured.title": "Featured Services",
    "contact.quick_contact": "Quick Contact",
    "contact.schedule": "Schedule Call",
    "feed.travel_update": "New Travel Packages Available",
    "feed.travel_content": "Discover amazing new destinations across Mexico with our curated travel experiences.",
    "feed.legal_tip": "Legal Tip: Business Registration",
    "feed.legal_content": "Essential steps for registering your business in Mexico. Our legal experts guide you through the process.",
    "feed.digital_showcase": "Digital Transformation Success Story",
    "feed.digital_content": "How we helped a local business increase their online presence by 300% with our digital solutions.",
    "action.learn_more": "Learn More",
    "contact.inquiry": "Inquiry",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("es");

  useEffect(() => {
    const saved = localStorage.getItem("mexivanza-language") as Language;
    if (saved && (saved === "es" || saved === "en")) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("mexivanza-language", lang);
  };

  const t = (key: string, fallback?: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};