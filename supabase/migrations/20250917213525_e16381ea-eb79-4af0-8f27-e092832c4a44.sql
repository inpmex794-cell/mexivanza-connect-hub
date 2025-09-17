-- Insert Categories (travel types)
INSERT INTO public.categories (name, slug, description) VALUES
('Vuelos', 'vuelos', 'Servicios de vuelos nacionales e internacionales'),
('Hoteles', 'hoteles', 'Alojamiento en hoteles y resorts'),
('Seguros', 'seguros', 'Seguros de viaje y asistencia'),
('Cruceros', 'cruceros', 'Experiencias en cruceros'),
('Alquiler', 'alquiler', 'Servicios de alquiler y renta'),
('Guías', 'guias', 'Servicios de guías turísticos'),
('Charters', 'charters', 'Servicios de charter privado'),
('Autos', 'autos', 'Renta de automóviles'),
('Paquetes Completos', 'paquetes-completos', 'Paquetes turísticos completos'),
('Escapadas', 'escapadas', 'Escapadas cortas y weekends'),
('Experiencias', 'experiencias', 'Experiencias únicas y actividades'),
('Tours Locales', 'tours-locales', 'Tours y recorridos locales'),
('Aventura', 'aventura', 'Turismo de aventura y deportes extremos'),
('Cultura', 'cultura', 'Turismo cultural e histórico'),
('Bienestar', 'bienestar', 'Turismo de bienestar y spa'),
('Naturaleza', 'naturaleza', 'Ecoturismo y naturaleza'),
('Playa', 'playa', 'Destinos de playa y costa'),
('Ciudad', 'ciudad', 'Turismo urbano y ciudades'),
('Romántico', 'romantico', 'Viajes románticos y luna de miel'),
('Familiar', 'familiar', 'Viajes familiares y con niños'),
('Lujo', 'lujo', 'Turismo de lujo y premium'),
('Económico', 'economico', 'Opciones económicas y presupuesto'),
('Transporte Privado', 'transporte-privado', 'Servicios de transporte privado');

-- Insert Tags (multi-select filters)
INSERT INTO public.tags (name, slug) VALUES
('Todo Incluido', 'todo-incluido'),
('Solo Adultos', 'solo-adultos'),
('Pet Friendly', 'pet-friendly'),
('Accesible', 'accesible'),
('Con Desayuno', 'con-desayuno'),
('Cancelación Gratis', 'cancelacion-gratis'),
('Con Guía', 'con-guia'),
('Seguro Incluido', 'seguro-incluido'),
('Transporte Incluido', 'transporte-incluido'),
('Actividades', 'actividades'),
('Excursiones', 'excursiones'),
('Spa', 'spa'),
('Piscina', 'piscina'),
('WiFi Gratis', 'wifi-gratis'),
('Vista al Mar', 'vista-al-mar'),
('Cocina Local', 'cocina-local'),
('Patrimonio', 'patrimonio'),
('Ecoturismo', 'ecoturismo'),
('Fotografía', 'fotografia'),
('Senderismo', 'senderismo'),
('Buceo', 'buceo'),
('Parques Naturales', 'parques-naturales'),
('Museos', 'museos'),
('Festivales', 'festivales'),
('Gastronomía', 'gastronomia'),
('Artesanía', 'artesania'),
('Historia', 'historia'),
('Arquitectura', 'arquitectura'),
('Tradiciones', 'tradiciones'),
('Pueblos Mágicos', 'pueblos-magicos');

-- Insert Features (trip-level toggles)
INSERT INTO public.features (name, description, icon) VALUES
('Reembolsable', 'Opción de reembolso disponible', 'refund'),
('Confirmación Instantánea', 'Confirmación inmediata de reserva', 'check-circle'),
('Pago en Línea', 'Pagos seguros en línea', 'credit-card'),
('Atención 24/7', 'Soporte las 24 horas', 'headphones'),
('Multilingüe', 'Servicio en múltiples idiomas', 'globe'),
('Itinerario Personalizado', 'Itinerarios adaptados a medida', 'route'),
('Video Promocional', 'Contenido audiovisual incluido', 'video'),
('Mapa Interactivo', 'Mapas interactivos disponibles', 'map'),
('Clima en Tiempo Real', 'Información meteorológica actualizada', 'cloud'),
('Nivel de Alerta de Viaje', 'Alertas de seguridad y viaje', 'alert-triangle'),
('Seguimiento de Visitantes', 'Tracking de visitantes y métricas', 'users');

-- Insert Services (linked to trips)
INSERT INTO public.services (name, description, icon) VALUES
('Vuelo Redondo', 'Vuelos de ida y vuelta incluidos', 'plane'),
('Hospedaje', 'Alojamiento incluido en el paquete', 'home'),
('Seguro de Viaje', 'Seguro de viaje y asistencia', 'shield'),
('Renta de Auto', 'Servicios de renta de automóviles', 'car'),
('Traslados', 'Traslados aeropuerto-hotel incluidos', 'bus'),
('Guía Turístico', 'Guía turístico profesional', 'user'),
('Actividades', 'Actividades y entretenimiento', 'activity'),
('Entradas', 'Entradas a sitios y atracciones', 'ticket'),
('Comidas', 'Comidas y gastronomía incluida', 'utensils'),
('Crucero', 'Experiencias en crucero', 'anchor'),
('Charter Privado', 'Servicios de charter privado', 'plane'),
('Asistencia Médica', 'Asistencia médica y emergencias', 'heart'),
('Concierge', 'Servicios de concierge', 'bell'),
('Alquiler de Autos', 'Renta de vehículos', 'car'),
('Transporte Privado', 'Transporte privado premium', 'car');

-- Insert Pages (public-facing content)
INSERT INTO public.pages (title, slug, content, status) VALUES
('Travel', 'travel', 'Página principal de viajes', 'published'),
('Travel Package Details', 'travel-package-id', 'Detalles del paquete de viaje', 'published'),
('Book Travel Package', 'travel-book-id', 'Reservar paquete de viaje', 'published'),
('Account', 'account', 'Página de cuenta de usuario', 'published'),
('Login', 'login', 'Página de inicio de sesión', 'published'),
('Dashboard', 'dashboard', 'Panel de administración', 'published'),
('Create New Trip', 'dashboard-trips-new', 'Crear nuevo viaje', 'published'),
('Media Management', 'dashboard-media', 'Gestión de medios', 'published'),
('Categories Management', 'dashboard-categories', 'Gestión de categorías', 'published'),
('Tags Management', 'dashboard-tags', 'Gestión de etiquetas', 'published'),
('Features Management', 'dashboard-features', 'Gestión de características', 'published'),
('Services Management', 'dashboard-services', 'Gestión de servicios', 'published'),
('Pages Management', 'dashboard-pages', 'Gestión de páginas', 'published'),
('Destinations', 'dashboard-destinations', 'Gestión de destinos', 'published'),
('New Destination', 'dashboard-destinations-new', 'Crear nuevo destino', 'published'),
('Edit Destination', 'dashboard-destinations-id', 'Editar destino', 'published'),
('Home', 'home', 'Página principal', 'published'),
('Contact', 'contact', 'Página de contacto', 'published'),
('Activities', 'activities', 'Página de actividades', 'published'),
('Extras', 'extras', 'Servicios adicionales', 'published');

-- Insert Destinations (all 32 Mexican states and their top tour cities)
INSERT INTO public.destinations (name, slug, region, description, status, featured) VALUES
-- Aguascalientes
('Aguascalientes', 'aguascalientes', 'Aguascalientes', 'Capital del estado de Aguascalientes', 'published', false),

-- Baja California
('Tijuana', 'tijuana', 'Baja California', 'Ciudad fronteriza vibrante', 'published', false),
('Ensenada', 'ensenada', 'Baja California', 'Capital del vino mexicano', 'published', true),

-- Baja California Sur
('La Paz', 'la-paz', 'Baja California Sur', 'Capital de Baja California Sur', 'published', false),
('Los Cabos', 'los-cabos', 'Baja California Sur', 'Destino turístico de clase mundial', 'published', true),
('Loreto', 'loreto', 'Baja California Sur', 'Pueblo mágico costero', 'published', false),

-- Campeche
('Campeche', 'campeche', 'Campeche', 'Ciudad fortificada patrimonio de la humanidad', 'published', true),
('Calakmul', 'calakmul', 'Campeche', 'Reserva de la biosfera maya', 'published', false),

-- Chiapas
('San Cristóbal de las Casas', 'san-cristobal-de-las-casas', 'Chiapas', 'Pueblo mágico colonial', 'published', true),
('Palenque', 'palenque', 'Chiapas', 'Zona arqueológica maya', 'published', true),
('Cañón del Sumidero', 'canon-del-sumidero', 'Chiapas', 'Parque nacional espectacular', 'published', false),

-- Chihuahua
('Chihuahua', 'chihuahua', 'Chihuahua', 'Capital del estado de Chihuahua', 'published', false),
('Creel', 'creel', 'Chihuahua', 'Pueblo en la Sierra Tarahumara', 'published', true),
('Barrancas del Cobre', 'barrancas-del-cobre', 'Chihuahua', 'Sistema de cañones espectacular', 'published', true),

-- Coahuila
('Saltillo', 'saltillo', 'Coahuila', 'Capital de Coahuila', 'published', false),
('Parras de la Fuente', 'parras-de-la-fuente', 'Coahuila', 'Pueblo mágico vinícola', 'published', false),

-- Colima
('Colima', 'colima', 'Colima', 'Capital del estado de Colima', 'published', false),
('Manzanillo', 'manzanillo', 'Colima', 'Puerto y destino de playa', 'published', true),

-- Durango
('Durango', 'durango', 'Durango', 'Capital del estado de Durango', 'published', false),
('Nombre de Dios', 'nombre-de-dios', 'Durango', 'Pueblo mágico histórico', 'published', false),

-- Guanajuato
('Guanajuato', 'guanajuato', 'Guanajuato', 'Ciudad patrimonio de la humanidad', 'published', true),
('San Miguel de Allende', 'san-miguel-de-allende', 'Guanajuato', 'Pueblo mágico colonial', 'published', true),

-- Guerrero
('Acapulco', 'acapulco', 'Guerrero', 'Puerto tradicional mexicano', 'published', true),
('Taxco', 'taxco', 'Guerrero', 'Pueblo mágico de la plata', 'published', true),
('Ixtapa-Zihuatanejo', 'ixtapa-zihuatanejo', 'Guerrero', 'Destino turístico de playa', 'published', true),

-- Hidalgo
('Pachuca', 'pachuca', 'Hidalgo', 'Capital del estado de Hidalgo', 'published', false),
('Real del Monte', 'real-del-monte', 'Hidalgo', 'Pueblo mágico minero', 'published', false),

-- Jalisco
('Guadalajara', 'guadalajara', 'Jalisco', 'Capital de Jalisco y mariachis', 'published', true),
('Tequila', 'tequila', 'Jalisco', 'Pueblo mágico del tequila', 'published', true),
('Puerto Vallarta', 'puerto-vallarta', 'Jalisco', 'Destino de playa internacional', 'published', true),

-- Estado de México
('Toluca', 'toluca', 'Estado de México', 'Capital del Estado de México', 'published', false),
('Valle de Bravo', 'valle-de-bravo', 'Estado de México', 'Pueblo mágico lacustre', 'published', true),
('Teotihuacán', 'teotihuacan', 'Estado de México', 'Zona arqueológica impresionante', 'published', true),

-- Ciudad de México
('Ciudad de México', 'ciudad-de-mexico', 'Ciudad de México', 'Capital de México', 'published', true),

-- Michoacán
('Morelia', 'morelia', 'Michoacán', 'Capital patrimonio de la humanidad', 'published', true),
('Pátzcuaro', 'patzcuaro', 'Michoacán', 'Pueblo mágico lacustre', 'published', true),

-- Morelos
('Cuernavaca', 'cuernavaca', 'Morelos', 'Ciudad de la eterna primavera', 'published', false),
('Tepoztlán', 'tepoztlan', 'Morelos', 'Pueblo mágico místico', 'published', true),

-- Nayarit
('Tepic', 'tepic', 'Nayarit', 'Capital del estado de Nayarit', 'published', false),
('Sayulita', 'sayulita', 'Nayarit', 'Pueblo bohemio surfero', 'published', true),
('Riviera Nayarit', 'riviera-nayarit', 'Nayarit', 'Destino turístico de lujo', 'published', true),

-- Nuevo León
('Monterrey', 'monterrey', 'Nuevo León', 'Capital industrial de México', 'published', true),
('Santiago', 'santiago', 'Nuevo León', 'Pueblo mágico de montaña', 'published', false),

-- Oaxaca
('Oaxaca', 'oaxaca', 'Oaxaca', 'Capital gastronómica y cultural', 'published', true),
('Huatulco', 'huatulco', 'Oaxaca', 'Destino de playa sustentable', 'published', true),
('Hierve el Agua', 'hierve-el-agua', 'Oaxaca', 'Cascadas petrificadas únicas', 'published', true),

-- Puebla
('Puebla', 'puebla', 'Puebla', 'Ciudad de los ángeles', 'published', true),
('Cholula', 'cholula', 'Puebla', 'Pueblo mágico arqueológico', 'published', false),

-- Querétaro
('Querétaro', 'queretaro', 'Querétaro', 'Ciudad patrimonio de la humanidad', 'published', true),
('Bernal', 'bernal', 'Querétaro', 'Pueblo mágico del monolito', 'published', false),

-- Quintana Roo
('Cancún', 'cancun', 'Quintana Roo', 'Destino turístico internacional', 'published', true),
('Tulum', 'tulum', 'Quintana Roo', 'Ruinas mayas frente al mar', 'published', true),
('Playa del Carmen', 'playa-del-carmen', 'Quintana Roo', 'Centro de la Riviera Maya', 'published', true),
('Cozumel', 'cozumel', 'Quintana Roo', 'Isla de buceo mundial', 'published', true),
('Bacalar', 'bacalar', 'Quintana Roo', 'Laguna de los siete colores', 'published', true),
('Holbox', 'holbox', 'Quintana Roo', 'Isla paradisíaca', 'published', true),

-- San Luis Potosí
('San Luis Potosí', 'san-luis-potosi', 'San Luis Potosí', 'Capital del estado', 'published', false),
('Real de Catorce', 'real-de-catorce', 'San Luis Potosí', 'Pueblo mágico minero', 'published', true),

-- Sinaloa
('Mazatlán', 'mazatlan', 'Sinaloa', 'Perla del Pacífico', 'published', true),
('Culiacán', 'culiacan', 'Sinaloa', 'Capital de Sinaloa', 'published', false),

-- Sonora
('Hermosillo', 'hermosillo', 'Sonora', 'Capital de Sonora', 'published', false),
('Puerto Peñasco', 'puerto-penasco', 'Sonora', 'Destino de playa del desierto', 'published', true),

-- Tabasco
('Villahermosa', 'villahermosa', 'Tabasco', 'Capital de Tabasco', 'published', false),
('Comalcalco', 'comalcalco', 'Tabasco', 'Zona arqueológica maya', 'published', false),

-- Tamaulipas
('Tampico', 'tampico', 'Tamaulipas', 'Puerto del Golfo de México', 'published', false),
('Ciudad Victoria', 'ciudad-victoria', 'Tamaulipas', 'Capital de Tamaulipas', 'published', false),

-- Tlaxcala
('Tlaxcala', 'tlaxcala', 'Tlaxcala', 'Capital del estado más pequeño', 'published', false),

-- Veracruz
('Veracruz', 'veracruz', 'Veracruz', 'Puerto histórico del Golfo', 'published', true),
('Xalapa', 'xalapa', 'Veracruz', 'Capital cultural de Veracruz', 'published', false),
('Papantla', 'papantla', 'Veracruz', 'Ciudad del totonacapan', 'published', false),

-- Yucatán
('Mérida', 'merida', 'Yucatán', 'Capital cultural de Yucatán', 'published', true),
('Chichén Itzá', 'chichen-itza', 'Yucatán', 'Maravilla del mundo moderno', 'published', true),
('Valladolid', 'valladolid', 'Yucatán', 'Pueblo mágico colonial', 'published', true),

-- Zacatecas
('Zacatecas', 'zacatecas', 'Zacatecas', 'Ciudad patrimonio de la humanidad', 'published', true),
('Jerez', 'jerez', 'Zacatecas', 'Pueblo mágico tradicional', 'published', false);

-- Update sequences to prevent conflicts
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('tags_id_seq', (SELECT MAX(id) FROM tags));
SELECT setval('features_id_seq', (SELECT MAX(id) FROM features));
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));
SELECT setval('pages_id_seq', (SELECT MAX(id) FROM pages));
SELECT setval('destinations_id_seq', (SELECT MAX(id) FROM destinations));