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
    // Site metadata
    "site.title": "Mexivanza - Servicios Integrales para México",
    "site.description": "Viajes, servicios legales y soluciones digitales en todo México",
    // Navigation
    "nav.home": "Inicio",
    "nav.travel": "Viajes",
    "nav.legal": "Legal", 
    "nav.digital": "Digital",
    "nav.services": "Servicios",
    "nav.login": "Iniciar Sesión",
    "nav.register": "Registrarse",
    "auth.login_full": "Login / Iniciar sesión",
    "auth.register_full": "Register / Registrarse",
    "nav.admin": "Panel Admin",
    "hero.title": "Servicios Integrales para México",
    "hero.subtitle": "Viajes, servicios legales y soluciones digitales en todo México",
    "hero.cta": "Comenzar Ahora",
    "hero.description": "Conectamos México con soluciones de primera clase",
    "auth.login": "Iniciar Sesión",
    "auth.register": "Registrarse",
    "auth.email": "Correo Electrónico",
    "auth.logout_success": "Sesión cerrada exitosamente",
    "post.created_success": "Post creado exitosamente",
    "content.updated": "Contenido actualizado",
    // Services and sections
    "services.premium": "Servicios Premium",
    "services.travel": "Viajes", 
    "services.travel_desc": "Paquetes premium",
    "services.legal": "Legal",
    "services.legal_desc": "Consulta gratuita",
    "services.webdev": "Desarrollo Web",
    "services.webdev_desc": "Soluciones digitales",
    "services.realestate": "Bienes Raíces",
    "services.realestate_desc": "Propiedades premium",
    "button.view_services": "Ver Servicios",
    "button.schedule_call": "Programar Llamada",
    "footer.description": "Plataforma integral de servicios para México",
    "legal.documents": "Documentos Legales",
    "legal.documents_desc": "Generar documentos legales",
    "company.description": "Plataforma integral de servicios profesionales en México",
    "services.catalog": "Servicios Mexivanza",
    "services.legal_consultation": "Servicios Legales",
    "services.legal_consultation_desc": "Consultoría legal profesional",
    "services.webdev_solutions": "Desarrollo Web",
    "services.webdev_solutions_desc": "Soluciones digitales empresariales",
    "auth.password": "Contraseña",
    "auth.forgot_password": "¿Olvidaste tu contraseña?",
    "auth.no_account": "¿No tienes cuenta?",
    "auth.have_account": "¿Ya tienes cuenta?",
    "footer.privacy": "Privacidad",
    "footer.terms": "Términos",
    "footer.contact": "Contacto",
    "whatsapp.general_inquiry": "¡Hola! Estoy interesado en los servicios de Mexivanza.",
    "whatsapp.travel_inquiry": "¡Hola! Me gustaría información sobre paquetes de viaje.",
    "whatsapp.legal_inquiry": "¡Hola! Necesito consultoría legal.",
    "whatsapp.digital_inquiry": "¡Hola! Estoy interesado en servicios digitales.",
    "stats.services": "Servicios",
    "stats.regions": "Regiones", 
    "stats.online": "En Línea",
    "stats.users": "Usuarios Activos",
    "stats.posts": "Posts Hoy",
    "stats.views": "Vistas de Página",
    "activity.travel_inquiry": "Consulta de viaje",
    "activity.legal_consultation": "Consulta legal",
    "activity.digital_service": "Servicio digital",
    "activity.new_user": "Nuevo usuario registrado",
    "activity.new_post": "Nuevo post publicado",
    "activity.video_upload": "Video subido",
    "activity.game_added": "Nuevo juego agregado",
    "featured.travel_packages": "Paquetes de Viaje",
    "featured.travel_desc": "Explora México con experiencias curadas",
    "featured.legal_support": "Soporte Legal",
    "featured.legal_desc": "Asistencia legal profesional",
    "featured.digital_solutions": "Soluciones Digitales",
    "featured.digital_desc": "Soluciones tecnológicas modernas para empresas",
    "featured.gaming": "Hub de Juegos",
    "featured.gaming_desc": "Descubre y comparte juegos increíbles",
    "featured.agents": "Agentes Verificados",
    "featured.agents_desc": "Conecta con profesionales inmobiliarios certificados",
    "featured.financial": "Mercado de Valores",
    "featured.financial_desc": "Análisis e información del mercado mexicano",
    "badge.popular": "Popular",
    "badge.trusted": "Confiable",
    "badge.new": "Nuevo",
    "nav.quick_actions": "Acciones Rápidas",
    "nav.regions": "Regiones", 
    "nav.actions": "Acciones Rápidas",
    "nav.dashboard": "Dashboard",
    "nav.profile": "Perfil",
    "nav.settings": "Configuración",
    "stats.title": "Estadísticas Rápidas",
    "activity.title": "Actividad Reciente",
    "featured.title": "Servicios Destacados",
    "contact.quick_contact": "Contacto Rápido",
    "contact.schedule": "Programar Llamada",
    "contact.whatsapp": "WhatsApp",
    "actions.quick": "Acciones Rápidas",
    "actions.create_post": "Crear Post",
    "actions.schedule": "Programar Evento",
    "actions.admin": "Panel Admin",
    "actions.analytics": "Ver Analíticas",
    "feed.travel_update": "Nuevos Paquetes de Viaje Disponibles",
    "feed.travel_content": "Descubre nuevos destinos increíbles en México con nuestras experiencias de viaje curadas.",
    "feed.legal_tip": "Consejo Legal: Registro de Empresas",
    "feed.legal_content": "Pasos esenciales para registrar tu empresa en México. Nuestros expertos legales te guían en el proceso.",
    "feed.digital_showcase": "Historia de Éxito en Transformación Digital",
    "feed.digital_content": "Cómo ayudamos a un negocio local a aumentar su presencia en línea en un 300% con nuestras soluciones digitales.",
    "action.learn_more": "Saber Más",
    "contact.inquiry": "Consulta",
    // Admin translations
    "admin.dashboard": "Panel de Administración",
    "admin.welcome": "Bienvenido de vuelta, Administrador",
    "admin.admin_access": "Acceso de Admin",
    "admin.total_users": "Total de Usuarios",
    "admin.total_posts": "Total de Posts",
    "admin.pending_moderation": "Pendientes de Moderación",
    "admin.active_agents": "Agentes Activos",
    "admin.admin_tools": "Herramientas de Admin",
    "admin.content_editor": "Editor de Contenido Global",
    "admin.content_desc": "Editar contenido y módulos de la plataforma",
    "admin.layout_manager": "Gestor de Diseño",
    "admin.layout_desc": "Gestionar diseños de página y componentes",
    "admin.service_publisher": "Publicación de Servicios",
    "admin.service_desc": "Publicar y gestionar servicios",
    "admin.verification": "Centro de Verificación",
    "admin.verification_desc": "Gestionar verificación de usuarios y agentes",
    "admin.moderation_queue": "Cola de Moderación",
    "admin.view_analytics": "Ver Analíticas",
    "admin.platform_metrics": "Métricas de la plataforma",
    "admin.manage_users": "Gestionar Usuarios",
    "admin.user_management": "Gestión de usuarios",
    "admin.edit_content": "Editar Contenido",
    "admin.content_management": "Gestión de contenido",
    // Verified user translations
    "verified.dashboard": "Panel Verificado",
    "verified.welcome": "Bienvenido de vuelta, usuario verificado",
    "verified.verified_status": "Verificado",
    "verified.my_posts": "Mis Posts",
    "verified.my_listings": "Mis Anuncios",
    "verified.messages": "Mensajes",
    "verified.earnings": "Ganancias",
    "verified.verified_features": "Características Verificadas",
    "verified.post_ads": "Publicar Anuncios",
    "verified.post_ads_desc": "Crear y gestionar tus anuncios",
    "verified.real_estate": "Listados Inmobiliarios",
    "verified.real_estate_desc": "Gestionar listados de propiedades",
    "verified.encrypted_messaging": "Mensajería Encriptada",
    "verified.messaging_desc": "Comunicación segura con clientes",
    "verified.web_dev_intake": "Proyectos Web Dev",
    "verified.web_dev_desc": "Gestionar proyectos de desarrollo",
    "verified.recent_activity": "Actividad Reciente",
    "verified.no_activity": "Sin actividad reciente",
    "verified.create_post": "Crear Post",
    "verified.share_content": "Comparte tu contenido",
    "verified.view_messages": "Ver Mensajes",
    "verified.client_communication": "Comunicación con clientes",
    "verified.account_settings": "Configuración de Cuenta",
    "verified.manage_account": "Gestionar tu cuenta"
  },
  en: {
    // Site metadata
    "site.title": "Mexivanza - Comprehensive Services for Mexico",
    "site.description": "Travel, legal services, and digital solutions throughout Mexico",
    // Navigation
    "nav.home": "Home",
    "nav.travel": "Travel",
    "nav.legal": "Legal",
    "nav.digital": "Digital", 
    "nav.services": "Services",
    "nav.login": "Login",
    "nav.register": "Register", 
    "auth.login_full": "Login / Iniciar sesión",
    "auth.register_full": "Register / Registrarse",
    "nav.admin": "Admin Panel",
    "hero.title": "Comprehensive Services for Mexico",
    "hero.subtitle": "Travel, legal services, and digital solutions throughout Mexico",
    "hero.cta": "Get Started",
    "hero.description": "Connecting Mexico with world-class solutions",
    "auth.login": "Login",
    "auth.logout_success": "Logout successful",
    "post.created_success": "Post created successfully", 
    "content.updated": "Content updated",
    // Services and sections
    "services.premium": "Premium Services",
    "services.travel": "Travel",
    "services.travel_desc": "Premium packages",
    "services.legal": "Legal",
    "services.legal_desc": "Free consultation",
    "services.webdev": "Web Development", 
    "services.webdev_desc": "Digital solutions",
    "services.realestate": "Real Estate",
    "services.realestate_desc": "Premium properties",
    "button.view_services": "View Services",
    "button.schedule_call": "Schedule Call",
    "footer.description": "Comprehensive services platform for Mexico",
    "legal.documents": "Legal Documents",
    "legal.documents_desc": "Generate legal documents", 
    "company.description": "Comprehensive professional services platform in Mexico",
    "services.catalog": "Mexivanza Services",
    "services.legal_consultation": "Legal Services",
    "services.legal_consultation_desc": "Professional legal consultation",
    "services.webdev_solutions": "Web Development",
    "services.webdev_solutions_desc": "Enterprise digital solutions",
    "auth.register": "Register",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.forgot_password": "Forgot your password?",
    "auth.no_account": "Don't have an account?",
    "auth.have_account": "Already have an account?",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.contact": "Contact",
    "whatsapp.general_inquiry": "Hello! I'm interested in Mexivanza services.",
    "whatsapp.travel_inquiry": "Hello! I'd like information about travel packages.",
    "whatsapp.legal_inquiry": "Hello! I need legal consultation.",
    "whatsapp.digital_inquiry": "Hello! I'm interested in digital services.",
    "stats.services": "Services",
    "stats.regions": "Regions", 
    "stats.online": "Online Now",
    "stats.users": "Active Users",
    "stats.posts": "Posts Today",
    "stats.views": "Page Views",
    "activity.travel_inquiry": "Travel inquiry",
    "activity.legal_consultation": "Legal consultation",
    "activity.digital_service": "Digital service",
    "activity.new_user": "New user registered",
    "activity.new_post": "New post published",
    "activity.video_upload": "Video uploaded",
    "activity.game_added": "New game added",
    "featured.travel_packages": "Travel Packages",
    "featured.travel_desc": "Explore Mexico with curated experiences",
    "featured.legal_support": "Legal Support",
    "featured.legal_desc": "Professional legal assistance",
    "featured.digital_solutions": "Digital Solutions",
    "featured.digital_desc": "Modern tech solutions for business",
    "featured.gaming": "Gaming Hub",
    "featured.gaming_desc": "Discover and share amazing games",
    "featured.agents": "Verified Agents",
    "featured.agents_desc": "Connect with certified real estate professionals",
    "featured.financial": "Stock Market",
    "featured.financial_desc": "Mexican market insights and analysis",
    "badge.popular": "Popular",
    "badge.trusted": "Trusted",
    "badge.new": "New",
    "nav.quick_actions": "Quick Actions",
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
    "contact.whatsapp": "WhatsApp",
    "actions.quick": "Quick Actions",
    "actions.create_post": "Create Post",
    "actions.schedule": "Schedule Event",
    "actions.admin": "Admin Panel",
    "actions.analytics": "View Analytics",
    "feed.travel_update": "New Travel Packages Available",
    "feed.travel_content": "Discover amazing new destinations across Mexico with our curated travel experiences.",
    "feed.legal_tip": "Legal Tip: Business Registration",
    "feed.legal_content": "Essential steps for registering your business in Mexico. Our legal experts guide you through the process.",
    "feed.digital_showcase": "Digital Transformation Success Story",
    "feed.digital_content": "How we helped a local business increase their online presence by 300% with our digital solutions.",
    "action.learn_more": "Learn More",
    "contact.inquiry": "Inquiry",
    // Admin translations
    "admin.dashboard": "Admin Dashboard",
    "admin.welcome": "Welcome back, Administrator",
    "admin.admin_access": "Admin Access",
    "admin.total_users": "Total Users",
    "admin.total_posts": "Total Posts",
    "admin.pending_moderation": "Pending Moderation",
    "admin.active_agents": "Active Agents",
    "admin.admin_tools": "Admin Tools",
    "admin.content_editor": "Global Content Editor",
    "admin.content_desc": "Edit platform content and modules",
    "admin.layout_manager": "Layout Manager",
    "admin.layout_desc": "Manage page layouts and components",
    "admin.service_publisher": "Service Publishing",
    "admin.service_desc": "Publish and manage services",
    "admin.verification": "Verification Center",
    "admin.verification_desc": "Manage user and agent verification",
    "admin.moderation_queue": "Moderation Queue",
    "admin.view_analytics": "View Analytics",
    "admin.platform_metrics": "Platform metrics",
    "admin.manage_users": "Manage Users",
    "admin.user_management": "User management",
    "admin.edit_content": "Edit Content",
    "admin.content_management": "Content management",
    // Verified user translations
    "verified.dashboard": "Verified Dashboard",
    "verified.welcome": "Welcome back, verified user",
    "verified.verified_status": "Verified",
    "verified.my_posts": "My Posts",
    "verified.my_listings": "My Listings",
    "verified.messages": "Messages",
    "verified.earnings": "Earnings",
    "verified.verified_features": "Verified Features",
    "verified.post_ads": "Post Advertisements",
    "verified.post_ads_desc": "Create and manage your ads",
    "verified.real_estate": "Real Estate Listings",
    "verified.real_estate_desc": "Manage property listings",
    "verified.encrypted_messaging": "Encrypted Messaging",
    "verified.messaging_desc": "Secure client communication",
    "verified.web_dev_intake": "Web Dev Projects",
    "verified.web_dev_desc": "Manage development projects",
    "verified.recent_activity": "Recent Activity",
    "verified.no_activity": "No recent activity",
    "verified.create_post": "Create Post",
    "verified.share_content": "Share your content",
    "verified.view_messages": "View Messages",
    "verified.client_communication": "Client communication",
    "verified.account_settings": "Account Settings",
    "verified.manage_account": "Manage your account"
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("es");
  const [, forceUpdate] = useState({}); // Force re-render trigger

  useEffect(() => {
    const saved = localStorage.getItem("mexivanza-language") as Language;
    if (saved && (saved === "es" || saved === "en")) {
      setLanguage(saved);
    }
  }, []);

  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    console.log(`Translation lookup: key="${key}", language="${language}", fallback="${fallback}"`);
    
    for (const k of keys) {
      value = value?.[k];
      console.log(`  Looking up "${k}":`, value);
    }
    
    const result = value || fallback || key;
    console.log(`  Final result:`, result);
    return result;
  };

  // Update document metadata when language changes
  useEffect(() => {
    const updateMetadata = () => {
      // Update document title
      document.title = t("site.title", "Mexivanza - Servicios Integrales para México");
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', t("site.description", "Viajes, servicios legales y soluciones digitales en todo México"));
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = t("site.description", "Viajes, servicios legales y soluciones digitales en todo México");
        document.head.appendChild(meta);
      }

      // Update lang attribute
      document.documentElement.lang = language;
      
      // Update Open Graph tags
      const updateOrCreateMeta = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (meta) {
          meta.setAttribute('content', content);
        } else {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          meta.setAttribute('content', content);
          document.head.appendChild(meta);
        }
      };

      updateOrCreateMeta('og:title', t("site.title", "Mexivanza - Servicios Integrales para México"));
      updateOrCreateMeta('og:description', t("site.description", "Viajes, servicios legales y soluciones digitales en todo México"));
      updateOrCreateMeta('og:locale', language === 'es' ? 'es_MX' : 'en_US');
    };

    updateMetadata();
  }, [language, t]);

  const handleSetLanguage = (lang: Language) => {
    console.log('Language changing from', language, 'to', lang);
    setLanguage(lang);
    localStorage.setItem("mexivanza-language", lang);
    
    // Force re-render of all components using this context
    forceUpdate({});
    
    // Trigger a custom event for components that need to react to language changes
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    console.log('Language change event dispatched');
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleSetLanguage, 
      t 
    }}>
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