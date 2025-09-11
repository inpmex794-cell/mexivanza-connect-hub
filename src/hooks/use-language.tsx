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
    "auth.login_full": "Iniciar Sesión",
    "auth.register_full": "Registrarse",
    "auth.processing": "Procesando...",
    "auth.no_account": "¿No tienes cuenta?",
    "auth.have_account": "¿Ya tienes cuenta?",
    "auth.login_button": "Iniciar Sesión",
    "auth.register_button": "Crear Cuenta",
    "auth.switch_to_register": "Crear Cuenta",
    "auth.switch_to_login": "Iniciar Sesión",
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
    "services.realestate_alt": "Inmobiliaria",
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
    // Module titles and buttons
    "modules.video_upload": "Subir Video",
    "modules.video_streaming": "Streaming de Video", 
    "modules.gaming_hub": "Hub de Juegos",
    "modules.financial_dashboard": "Dashboard Financiero",
    "modules.verified_agents": "Agentes Verificados",
    "modules.trademark_registration": "Registro de Marca Comercial",
    "button.view_market": "Ver Mercado",
    "button.find_agents": "Encontrar Agentes",
    "button.register_trademark": "Registrar Marca",
    "button.generate_documents": "Generar Documentos",
    "button.contact_whatsapp": "Contactar WhatsApp",
    "hero.title_default": "Plataforma Integral Mexivanza",
    "hero.description_default": "Servicios profesionales de viaje, legal, desarrollo web y bienes raíces. Conectando México con soluciones de primera clase.",
    "posts.create": "Crear",
    "posts.login_required": "Debes iniciar sesión para crear posts",
    "posts.complete_fields": "Por favor completa el título y contenido",
    "posts.error_creating": "Error al crear el post",
    // Footer and navigation
    "footer.legal.incorporation": "Constitución de Empresas",
    "footer.legal.immigration": "Derecho Migratorio", 
    "footer.legal.real_estate": "Bienes Raíces",
    "footer.legal.tax": "Derecho Fiscal",
    "footer.digital.web_dev": "Desarrollo Web",
    "footer.digital.marketing": "Marketing Digital",
    "footer.digital.ecommerce": "E-commerce",
    "footer.digital.consulting": "Consultoría Tech",
    // Video/Media
    "video.upload": "Subir Video",
    "video.streaming": "Streaming de Video",
    "video.watch": "Ver",
    "video.watch_live": "Ver en Vivo",
    // Copyright and legal
    "footer.copyright": "© 2024 Mexivanza. Todos los derechos reservados.",
    "footer.privacy": "Política de Privacidad",
    "footer.terms": "Términos de Servicio",
    // Common form fields
    "form.name": "Nombre",
    "form.email": "Email",
    "form.phone": "Teléfono",
    "form.message": "Mensaje",
    "form.select": "Selecciona",
    "form.title": "Título",
    "form.description": "Descripción",
    "form.category": "Categoría",
    "form.location": "Ubicación",
    "form.select_category": "Selecciona una categoría",
    "form.select_option": "Selecciona una opción",
    // Common buttons and actions
    "button.create": "Crear",
    "button.edit": "Editar", 
    "button.save": "Guardar",
    "button.cancel": "Cancelar",
    "button.delete": "Eliminar",
    "button.add": "Agregar",
    "button.next": "Siguiente",
    "button.previous": "Anterior",
    "button.confirm": "Confirmar",
    "button.send": "Enviar",
    "button.submit": "Enviar",
    "button.search": "Buscar",
    "button.explore": "Explorar",
    "button.learn_more": "Saber Más",
    "button.read_more": "Leer Más",
    "button.view_more": "Ver Más",
    "button.get_started": "Comenzar",
    "button.contact": "Contactar",
    "button.book_now": "Reservar Ahora",
    "button.apply": "Aplicar",
    "button.download": "Descargar",
    "button.upload": "Subir",
    "button.close": "Cerrar",
    "button.open": "Abrir",
    "button.welcome": "Bienvenido",
    "button.logout": "Cerrar Sesión",
    "button.share": "Compartir",
    "button.featured": "Destacado",
    "button.specialists": "Especialistas",
    "real_estate.specialists": "Especialistas en Bienes Raíces",
    "real_estate.inmobiliaria": "Bienes Raíces",
    // Navigation and UI elements
    // Form placeholders
    "form.post_title": "Título del post...",
    "form.post_content": "Comparte tu experiencia...",
    "form.post_placeholder": "¿Qué quieres compartir hoy?",
    // Web dev title
    "web_dev.title": "Desarrollo Web",
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
    "nav.dashboard": "Panel de Control",
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
    // Additional form and interface translations
    "trademark.form.trademark_name": "Nombre de la Marca",
    "trademark.form.applicant_name": "Nombre del Solicitante",
    "trademark.form.full_address": "Dirección Completa",
    "trademark.form.trademark_description": "Descripción de la Marca",
    "trademark.form.trademark_placeholder": "Describe tu marca, productos o servicios...",
    "trademark.form.usage_scenario": "Escenario de Uso",
    "trademark.form.usage_placeholder": "¿Cómo planeas usar esta marca?",
    "trademark.form.continue_classes": "Continuar a Clases",
    "trademark.form.select_classes": "Selecciona las Clases de Marca",
    "trademark.form.select_classes_desc": "Elige las categorías que mejor describan tus productos o servicios.",
    "trademark.form.class": "Clase",
    "trademark.form.back": "Volver",
    "trademark.form.submit": "Enviar Solicitud",
    "trademark.form.submitting": "Enviando...",
    "trademark.success.title": "¡Solicitud Enviada!",
    "trademark.success.message": "Tu solicitud de registro de marca ha sido enviada exitosamente. Recibirás una confirmación por email y un especialista se pondrá en contacto contigo.",
    "trademark.success.new_application": "Nueva Solicitud",
    "trademark.step.information": "Información",
    "trademark.step.classes": "Clases",
    "trademark.step.confirm": "Confirmar",
    // Legal document generator translations
    "legal.select_template": "Selecciona un Template",
    "legal.select_template_placeholder": "Elige el tipo de documento",
    "legal.service_contract": "Contrato de Servicios",
    "legal.power_attorney": "Poder Notarial",
    "legal.nda": "Acuerdo de Confidencialidad",
    "legal.employment": "Contrato Laboral",
    "legal.client_name": "Nombre del Cliente",
    "legal.provider_name": "Nombre del Proveedor",
    "legal.service_description": "Descripción del Servicio",
    "legal.amount": "Monto",
    "legal.currency": "Moneda",
    "legal.start_date": "Fecha de Inicio",
    "legal.end_date": "Fecha de Término",
    "legal.grantor_name": "Nombre del Otorgante",
    "legal.attorney_name": "Nombre del Apoderado",
    "legal.powers_granted": "Facultades Otorgadas",
    "legal.preview": "Vista Previa",
    "legal.generate": "Generar Documento",
    "legal.generating": "Generando...",
    "legal.preview_title": "Vista Previa del Documento",
    "legal.download_pdf": "Descargar PDF",
    // Video upload translations
    "video.upload_title": "Subir Video",
    "video.video_title": "Título del Video",
    "video.video_description": "Descripción del Video",
    "video.select_category": "Selecciona una Categoría",
    "video.entertainment": "Entretenimiento",
    "video.education": "Educación",
    "video.business": "Negocios",
    "video.travel": "Viajes",
    "video.upload_button": "Subir Video",
    "video.uploading": "Subiendo...",
    "video.video_url": "URL del video (YouTube, Vimeo, etc.)",
    // Weather translations
    "weather.today": "Hoy",
    "weather.tomorrow": "Mañana", 
    "weather.day_after": "Pasado mañana",
    "weather.uv_alert": "Índice UV alto. Use protector solar.",
    "weather.sunny": "Soleado",
    "weather.partly_cloudy": "Parcialmente nublado",
    "weather.cloudy": "Nublado",
    "weather.rainy": "Lluvioso",
    "weather.stormy": "Tormentoso", 
    "weather.snowy": "Nevando",
    "weather.feels_like": "Se siente como",
    "weather.humidity": "Humedad",
    "weather.wind": "Viento",
    "weather.visibility": "Visibilidad",
    "weather.pressure": "Presión",
    "weather.uv_index": "Índice UV",
    "weather.alerts": "Alertas Meteorológicas",
    "weather.forecast": "Pronóstico 3 Días",
    "weather.uv_high": "Alto",
    "weather.uv_moderate": "Moderado",
    "weather.uv_low": "Bajo",
    "weather.alert": "Alerta Meteorológica",
    "weather.error": "No se pueden cargar los datos meteorológicos",
    "weather.last_updated": "Última actualización",
    // Travel translations
    "travel.packages_title": "Paquetes de Viaje",
    "travel.packages_subtitle": "Descubre México con nuestras experiencias de viaje seleccionadas",
    "travel.book_now": "Reservar Ahora",
    "travel.days": "días",
    "travel.spots": "lugares",
    "travel.from": "Desde",
    "travel.featured": "Destacado",
    "travel.demo": "Demo",
    "travel.sold_out": "Agotado",
    "travel.my_bookings": "Mis Reservas",
    "travel.booking_confirmed": "¡Reserva Confirmada!",
    "travel.payment_successful": "Tu pago fue procesado exitosamente",
    "travel.categories_title": "Servicios de Viaje",
    "travel.categories_subtitle": "Soluciones completas de viaje para tu viaje perfecto a México",
    "travel.flights": "Vuelos",
    "travel.hotels": "Hoteles", 
    "travel.insurance": "Seguros",
    "travel.cruises": "Cruceros",
    "travel.airbnb": "Airbnb",
    "travel.tour_guides": "Guías",
    "travel.charters": "Charters",
    "travel.car_rentals": "Autos",
    "video.login_required": "Debes iniciar sesión para subir videos",
    "video.required_fields": "Título y URL del video son requeridos",
    "video.upload_success": "Video subido exitosamente",
    "video.upload_error": "Error al subir el video",
    // Additional toast messages
    "legal.login_required": "Debes iniciar sesión para generar documentos",
    "legal.generate_success": "Documento generado exitosamente",
    "legal.generate_error": "Error al generar el documento",
    "trademark.login_required": "Debes iniciar sesión para registrar una marca",
    "trademark.submit_success": "Solicitud de marca registrada exitosamente",
    "trademark.submit_error": "Error al enviar la solicitud",
    // Footer companies section
    "footer.companies": "Empresas",
    "footer.about": "Acerca de",
    "footer.contact_spanish": "Contacto",
    "footer.careers": "Carreras",
    "footer.blog": "Blog",
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
    "verified.manage_account": "Gestionar tu cuenta",
    // Directory translations
    "directory.title": "Directorio",
    "directory.subtitle": "Directorio de Negocios",
    "directory.verified_businesses": "Negocios verificados",
    "directory.search_placeholder": "Buscar negocios...",
    "directory.filter_category": "Filtrar por categoría",
    "directory.filter_location": "Filtrar por ubicación",
    "directory.all_categories": "Todas las categorías",
    "directory.all_locations": "Todas las ubicaciones",
    "directory.verified": "Verificado",
    "directory.contact": "Contactar",
    "directory.view_profile": "Ver Perfil",
    "directory.no_results": "No se encontraron negocios",
    "directory.submit_business": "Registrar Negocio",
    "directory.business_name": "Nombre del Negocio",
    "directory.business_description": "Descripción del Negocio",
    "directory.business_category": "Categoría del Negocio",
    "directory.business_location": "Ubicación",
    "directory.business_phone": "Teléfono",
    "directory.business_website": "Sitio Web",
    "directory.business_logo": "Logo del Negocio",
    "directory.verification_documents": "Documentos de Verificación",
    "directory.submit_for_review": "Enviar para Revisión",
    "directory.submission_success": "Negocio enviado para revisión exitosamente",
    // Travel categories specific
    "travel.explore_packages": "Explorar Paquetes",
    "travel.packages": "paquetes",
    // Real estate specific  
    "real_estate.properties": "propiedades",
    "real_estate.verified": "Verificadas",
    "real_estate.title": "Bienes Raíces",
    // Posts
    "posts.recent_posts": "Posts Recientes",
    "posts.posts": "posts",
    "posts.no_posts": "No hay posts disponibles",
    // Search translations
    "search.placeholder": "Buscar servicios, regiones...",
    "search.mobile_placeholder": "Buscar...",
    // Travel search
    "travel.search_placeholder": "Buscar destinos, proveedores, servicios...",
    // Real estate search  
    "realestate.search": "Buscar propiedades..."
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
    "auth.login_full": "Login",
    "auth.register_full": "Register",
    "auth.processing": "Processing...",
    "auth.no_account": "Don't have an account?",
    "auth.have_account": "Already have an account?",
    "auth.login_button": "Sign In",
    "auth.register_button": "Create Account",
    "auth.switch_to_register": "Create Account",
    "auth.switch_to_login": "Sign In",
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
    "services.realestate_alt": "Real Estate",
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
    // Module titles and buttons  
    "modules.video_upload": "Upload Video",
    "modules.video_streaming": "Video Streaming",
    "modules.gaming_hub": "Gaming Hub", 
    "modules.financial_dashboard": "Financial Dashboard",
    "modules.verified_agents": "Verified Agents",
    "modules.trademark_registration": "Trademark Registration",
    "button.view_market": "View Market",
    "button.find_agents": "Find Agents", 
    "button.register_trademark": "Register Trademark",
    "button.generate_documents": "Generate Documents",
    "button.contact_whatsapp": "Contact WhatsApp",
    "hero.title_default": "Comprehensive Mexivanza Platform",
    "hero.description_default": "Professional travel, legal, web development and real estate services. Connecting Mexico with world-class solutions.",
    "posts.create": "Create",
    "posts.login_required": "You must log in to create posts",
    "posts.complete_fields": "Please complete title and content",
    "posts.error_creating": "Error creating post",
    // Footer and navigation
    "footer.legal.incorporation": "Business Incorporation",
    "footer.legal.immigration": "Immigration Law",
    "footer.legal.real_estate": "Real Estate",
    "footer.legal.tax": "Tax Law",
    "footer.digital.web_dev": "Web Development", 
    "footer.digital.marketing": "Digital Marketing",
    "footer.digital.ecommerce": "E-commerce",
    "footer.digital.consulting": "Tech Consulting",
    // Video/Media
    "video.upload": "Upload Video",
    "video.streaming": "Video Streaming",
    "video.watch": "Watch",
    "video.watch_live": "Watch Live",
    // Copyright and legal
    "footer.copyright": "© 2024 Mexivanza. All rights reserved.",
    "footer.privacy": "Privacy Policy", 
    "footer.terms": "Terms of Service",
    // Common form fields
    "form.name": "Name",
    "form.email": "Email", 
    "form.phone": "Phone",
    "form.message": "Message",
    "form.select": "Select",
    "form.title": "Title",
    "form.description": "Description",
    "form.category": "Category",
    "form.location": "Location",
    "form.select_category": "Select a category",
    "form.select_option": "Select an option",
    // Common buttons and actions
    "button.create": "Create",
    "button.edit": "Edit",
    "button.save": "Save", 
    "button.cancel": "Cancel",
    "button.delete": "Delete",
    "button.add": "Add",
    "button.next": "Next",
    "button.previous": "Previous",
    "button.confirm": "Confirm",
    "button.send": "Send",
    "button.submit": "Submit",
    "button.search": "Search",
    "button.explore": "Explore",
    "button.learn_more": "Learn More",
    "button.read_more": "Read More",
    "button.view_more": "View More",
    "button.get_started": "Get Started",
    "button.contact": "Contact",
    "button.book_now": "Book Now",
    "button.apply": "Apply",
    "button.download": "Download",
    "button.upload": "Upload",
    "button.close": "Close",
    "button.open": "Open",
    "button.welcome": "Welcome",
    "button.logout": "Logout",
    "button.share": "Share",
    "button.featured": "Featured",
    "button.specialists": "Specialists",
    "real_estate.specialists": "Real Estate Specialists",
    "real_estate.inmobiliaria": "Real Estate",
    // Navigation and UI elements  
    // Form placeholders
    "form.post_title": "Post title...",
    "form.post_content": "Share your experience...",
    "form.post_placeholder": "What do you want to share today?",
    // Web dev title
    "web_dev.title": "Web Development",
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
    "verified.manage_account": "Manage your account",
    // Additional form and interface translations
    "trademark.form.trademark_name": "Trademark Name",
    "trademark.form.applicant_name": "Applicant Name",
    "trademark.form.full_address": "Full Address",
    "trademark.form.trademark_description": "Trademark Description",
    "trademark.form.trademark_placeholder": "Describe your trademark, products or services...",
    "trademark.form.usage_scenario": "Usage Scenario",
    "trademark.form.usage_placeholder": "How do you plan to use this trademark?",
    "trademark.form.continue_classes": "Continue to Classes",
    "trademark.form.select_classes": "Select Trademark Classes",
    "trademark.form.select_classes_desc": "Choose the categories that best describe your products or services.",
    "trademark.form.class": "Class",
    "trademark.form.back": "Back",
    "trademark.form.submit": "Submit Application",
    "trademark.form.submitting": "Submitting...",
    "trademark.success.title": "Application Submitted!",
    "trademark.success.message": "Your trademark registration application has been submitted successfully. You will receive an email confirmation and a specialist will contact you.",
    "trademark.success.new_application": "New Application",
    "trademark.step.information": "Information",
    "trademark.step.classes": "Classes",
    "trademark.step.confirm": "Confirm",
    // Legal document generator translations
    "legal.select_template": "Select a Template",
    "legal.select_template_placeholder": "Choose document type",
    "legal.service_contract": "Service Contract",
    "legal.power_attorney": "Power of Attorney",
    "legal.nda": "Confidentiality Agreement",
    "legal.employment": "Employment Contract",
    "legal.client_name": "Client Name",
    "legal.provider_name": "Provider Name",
    "legal.service_description": "Service Description",
    "legal.amount": "Amount",
    "legal.currency": "Currency",
    "legal.start_date": "Start Date",
    "legal.end_date": "End Date",
    "legal.grantor_name": "Grantor Name",
    "legal.attorney_name": "Attorney Name",
    "legal.powers_granted": "Powers Granted",
    "legal.preview": "Preview",
    "legal.generate": "Generate Document",
    "legal.generating": "Generating...",
    "legal.preview_title": "Document Preview",
    "legal.download_pdf": "Download PDF",
    // Video upload translations
    "video.upload_title": "Upload Video",
    "video.video_title": "Video Title",
    "video.video_description": "Video Description",
    "video.select_category": "Select a Category",
    "video.entertainment": "Entertainment",
    "video.education": "Education",
    "video.business": "Business",
    "video.travel": "Travel",
    "video.upload_button": "Upload Video",
    "video.uploading": "Uploading...",
    "video.video_url": "Video URL (YouTube, Vimeo, etc.)",
    // Weather translations
    "weather.today": "Today",
    "weather.tomorrow": "Tomorrow",
    "weather.day_after": "Day after",
    "weather.uv_alert": "High UV index. Use sunscreen.",
    "weather.sunny": "Sunny",
    "weather.partly_cloudy": "Partly Cloudy",
    "weather.cloudy": "Cloudy", 
    "weather.rainy": "Rainy",
    "weather.stormy": "Stormy",
    "weather.snowy": "Snowy",
    "weather.feels_like": "Feels like",
    "weather.humidity": "Humidity",
    "weather.wind": "Wind",
    "weather.visibility": "Visibility",
    "weather.pressure": "Pressure",
    "weather.uv_index": "UV Index",
    "weather.alerts": "Weather Alerts",
    "weather.forecast": "3-Day Forecast",
    "weather.uv_high": "High",
    "weather.uv_moderate": "Moderate",
    "weather.uv_low": "Low",
    "weather.alert": "Weather Alert",
    "weather.error": "Unable to load weather data", 
    "weather.last_updated": "Last updated",
    // Travel translations
    "travel.packages_title": "Travel Packages",
    "travel.packages_subtitle": "Discover Mexico with our curated travel experiences",
    "travel.book_now": "Book Now",
    "travel.days": "days",
    "travel.spots": "spots",
    "travel.from": "From",
    "travel.featured": "Featured",
    "travel.demo": "Demo",
    "travel.sold_out": "Sold Out",
    "travel.my_bookings": "My Bookings",
    "travel.booking_confirmed": "Booking Confirmed!",
    "travel.payment_successful": "Your payment was processed successfully",
    "travel.categories_title": "Travel Services",
    "travel.categories_subtitle": "Complete travel solutions for your perfect trip to Mexico",
    "travel.flights": "Flights",
    "travel.hotels": "Hotels",
    "travel.insurance": "Insurance", 
    "travel.cruises": "Cruises",
    "travel.airbnb": "Airbnb",
    "travel.tour_guides": "Tour Guides",
    "travel.charters": "Charters",
    "travel.car_rentals": "Car Rentals",
    "video.login_required": "You must log in to upload videos",
    "video.required_fields": "Title and video URL are required",
    "video.upload_success": "Video uploaded successfully",
    "video.upload_error": "Error uploading video",
    // Additional toast messages  
    "legal.login_required": "You must log in to generate documents",
    "legal.generate_success": "Document generated successfully",
    "legal.generate_error": "Error generating document",
    "trademark.login_required": "You must log in to register a trademark",
    "trademark.submit_success": "Trademark application submitted successfully",
    "trademark.submit_error": "Error submitting application",
    // Footer companies section
    "footer.companies": "Companies",
    "footer.about": "About",
    "footer.contact_english": "Contact",
    "footer.careers": "Careers",
    "footer.blog": "Blog",
    // Directory translations
    "directory.title": "Directory",
    "directory.subtitle": "Business Directory", 
    "directory.verified_businesses": "Verified businesses",
    "directory.search_placeholder": "Search businesses...",
    "directory.filter_category": "Filter by category",
    "directory.filter_location": "Filter by location",
    "directory.all_categories": "All categories",
    "directory.all_locations": "All locations",
    "directory.verified": "Verified",
    "directory.contact": "Contact",
    "directory.view_profile": "View Profile",
    "directory.no_results": "No businesses found",
    "directory.submit_business": "Submit Business",
    "directory.business_name": "Business Name",
    "directory.business_description": "Business Description",
    "directory.business_category": "Business Category",
    "directory.business_location": "Location",
    "directory.business_phone": "Phone",
    "directory.business_website": "Website",
    "directory.business_logo": "Business Logo",
    "directory.verification_documents": "Verification Documents",
    "directory.submit_for_review": "Submit for Review",
    "directory.submission_success": "Business submitted for review successfully",
    // Travel categories specific
    "travel.explore_packages": "Explore Packages",
    "travel.packages": "packages",
    // Real estate specific
    "real_estate.properties": "properties", 
    "real_estate.verified": "Verified",
    "real_estate.title": "Real Estate",
    // Posts
    "posts.recent_posts": "Recent Posts",
    "posts.posts": "posts", 
    "posts.no_posts": "No posts available",
    // Search translations
    "search.placeholder": "Search services, regions...",
    "search.mobile_placeholder": "Search...",
    // Travel search
    "travel.search_placeholder": "Search destinations, providers, services...",
    // Real estate search
    "realestate.search": "Search properties..."
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
    // Check if it's a direct key first (like "services.premium")
    let value: any = translations[language]?.[key];
    
    if (value) {
      console.log(`Direct key found: "${key}" = "${value}"`);
      return value;
    }
    
    // If not found as direct key, try nested lookup
    value = translations[language];
    const keyParts = key.split('.');
    
    console.log(`Translation lookup: key="${key}", language="${language}", fallback="${fallback}"`);
    console.log('Trying nested lookup...');
    
    for (const k of keyParts) {
      const prevValue = value;
      value = value?.[k];
      console.log(`  Looking up "${k}" in:`, typeof prevValue, `→ result:`, typeof value, value);
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