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