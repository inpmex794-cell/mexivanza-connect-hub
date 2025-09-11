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
    "nav.admin": "Panel Admin",
    "hero.title": "Servicios Integrales para México",
    "hero.subtitle": "Viajes, servicios legales y soluciones digitales en todo México",
    "hero.cta": "Comenzar Ahora",
    "auth.email": "Correo Electrónico",
    "auth.password": "Contraseña",
    "auth.login": "Iniciar Sesión",
    "auth.register": "Registrarse",
    "auth.forgot": "¿Olvidaste tu contraseña?",
    "auth.required": "Inicia sesión para continuar",
    "whatsapp.travel": "Consulta de Viajes",
    "whatsapp.legal": "Consulta Legal",
    "whatsapp.digital": "Consulta Digital",
    "region.north": "Norte",
    "region.pacific": "Pacífico",
    "region.central": "Centro",
    "region.southeast": "Sureste",
    "dashboard.welcome": "Bienvenido a tu panel",
    "dashboard.logout": "Cerrar Sesión",
    "dashboard.admin": "Administrador",
    "dashboard.user": "Usuario",
    "search.placeholder": "Buscar servicios, regiones...",
    "nav.services": "Servicios",
    "nav.regions": "Regiones",
    "nav.actions": "Acciones Rápidas",
    "nav.dashboard": "Panel",
    "nav.profile": "Perfil",
    "nav.settings": "Configuración",
    "stats.title": "Estadísticas Rápidas",
    "stats.users": "Usuarios Activos",
    "stats.posts": "Posts Hoy",
    "stats.views": "Vistas de Página",
    "stats.services": "Servicios",
    "stats.regions": "Regiones",
    "stats.online": "En Línea Ahora",
    "activity.title": "Actividad Reciente",
    "activity.new_user": "Nuevo usuario registrado",
    "activity.new_post": "Nueva publicación",
    "activity.video_upload": "Video subido",
    "activity.game_added": "Nuevo juego agregado",
    "activity.travel_inquiry": "Consulta de viaje",
    "activity.legal_consultation": "Consulta legal",
    "activity.digital_service": "Servicio digital",
    "featured.title": "Servicios Destacados",
    "featured.gaming": "Hub de Juegos",
    "featured.gaming_desc": "Descubre y comparte juegos increíbles",
    "featured.agents": "Agentes Verificados",
    "featured.agents_desc": "Conecta con profesionales inmobiliarios certificados",
    "featured.financial": "Mercado de Valores",
    "featured.financial_desc": "Información del mercado mexicano y análisis",
    "contact.quick_contact": "Contacto Rápido",
    "contact.schedule": "Programar Llamada",
    "contact.whatsapp": "WhatsApp",
    "contact.inquiry": "Consulta",
    "actions.quick": "Acciones Rápidas",
    "actions.create_post": "Crear Publicación",
    "actions.schedule": "Programar Evento",
    "actions.admin": "Panel Admin",
    "actions.analytics": "Ver Análisis",
    "modules.video": "Transmisión de Video",
    "modules.video_desc": "Sube, comparte y mira contenido de video de creadores verificados",
    "modules.gaming": "Hub de Juegos",
    "modules.gaming_desc": "Descubre, reseña y comparte juegos increíbles en todas las plataformas",
    "modules.financial": "Bolsa de Valores",
    "modules.financial_desc": "Panel del mercado de valores mexicano con datos en tiempo real y análisis",
    "video.title": "Transmisión de Video",
    "video.subtitle": "Mira y comparte contenido de video",
    "video.upload": "Subir Video",
    "video.play": "Reproducir",
    "video.no_videos": "No hay videos disponibles",
    "video.no_videos_desc": "¡Sé el primero en subir un video!",
    "gaming.title": "Hub de Juegos",
    "gaming.subtitle": "Descubre juegos increíbles y comparte tus favoritos",
    "gaming.no_games": "No hay juegos disponibles",
    "gaming.no_games_desc": "¡Sé el primero en agregar un juego al hub!",
    "gaming.play": "Jugar",
    "gaming.discuss": "Discutir",
    "gaming.like_error": "Error al actualizar me gusta",
    "financial.title": "Bolsa de Valores",
    "financial.subtitle": "Panel del Mercado de Valores Mexicano",
    "financial.disclaimer_title": "Aviso de Inversión",
    "financial.disclaimer": "Esta información es solo para fines educativos y no debe considerarse como consejo de inversión.",
    "financial.total_market_cap": "Cap. de Mercado Total",
    "financial.active_stocks": "Acciones Activas",
    "financial.market_status": "Estado del Mercado",
    "financial.market_open": "Mercado Abierto",
    "financial.volume": "Volumen",
    "financial.market_cap": "Cap. de Mercado",
    "financial.no_data": "No hay datos financieros disponibles",
    "financial.last_updated": "Última actualización",
    "weather.error": "No se pueden cargar los datos del clima",
    "weather.humidity": "Humedad",
    "weather.wind": "Viento",
    "weather.visibility": "Visibilidad",
    "weather.uv_index": "Índice UV",
    "weather.alert": "Alerta Meteorológica",
    "weather.forecast": "Pronóstico de 3 Días",
    "weather.last_updated": "Última actualización",
    "agents.title": "Agentes Inmobiliarios Verificados",
    "agents.subtitle": "Conecta con profesionales inmobiliarios certificados",
    "agents.all_regions": "Todas las Regiones",
    "agents.verified": "Verificado",
    "agents.license": "Licencia",
    "agents.contact": "Contactar",
    "agents.no_agents": "No se encontraron agentes verificados",
    "agents.no_agents_desc": "No hay agentes verificados disponibles actualmente.",
    "agents.verification_note": "Todos los agentes son profesionales inmobiliarios verificados y con licencia",
    "action.learn_more": "Saber Más",
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