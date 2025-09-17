-- Sample travel packages data for Mexivanza Connect Hub
-- Run this to populate the database with realistic Mexico travel packages

-- Insert destinations
INSERT INTO public.destinations (name, slug, description, region, status, featured) VALUES
('Cancún', 'cancun', 'Destino de playa mundialmente reconocido en la Península de Yucatán, ofreciendo costa caribeña espectacular, vibrante vida nocturna y rica herencia maya.', 'Yucatán', 'published', true),
('Tulum', 'tulum', 'Antigua ciudad portuaria maya ubicada en dramáticos acantilados con vista al Mar Caribe, combinando maravillas arqueológicas con playas prístinas.', 'Riviera Maya', 'published', true),
('Playa del Carmen', 'playa-del-carmen', 'Vibrante ciudad costera en la Riviera Maya, famosa por sus playas de arena blanca, cenotes y proximidad a antiguas ruinas mayas.', 'Riviera Maya', 'published', true),
('Puerto Vallarta', 'puerto-vallarta', 'Sofisticada ciudad turística de la costa del Pacífico que combina el encanto tradicional mexicano con comodidades de lujo.', 'Costa del Pacífico', 'published', true),
('Mérida', 'merida', 'Capital colonial de Yucatán, rica en cultura maya, hermosa arquitectura y gastronomía tradicional mexicana.', 'Yucatán', 'published', false),
('Cozumel', 'cozumel', 'Destino premier de buceo en el Caribe, hogar del Sistema Arrecifal Mesoamericano y biodiversidad submarina de clase mundial.', 'Yucatán', 'published', false);

-- Insert categories
INSERT INTO public.categories (name, slug, description) VALUES
('Playa', 'beach', 'Destinos costeros con playas prístinas y actividades acuáticas'),
('Aventura', 'adventure', 'Experiencias llenas de acción incluyendo buceo, tirolesas y exploración'),
('Cultural', 'cultural', 'Sitios históricos, ruinas arqueológicas e inmersión cultural auténtica'),
('Lujo', 'luxury', 'Experiencias de viaje premium con alojamientos y servicios de clase mundial'),
('Bienestar', 'wellness', 'Retiros de spa, experiencias de yoga y viajes de sanación holística'),
('Buceo', 'diving', 'Exploración submarina de arrecifes, cenotes y ecosistemas marinos');

-- Insert tags
INSERT INTO public.tags (name, slug) VALUES
('Lujo', 'luxury'),
('Familiar', 'family'),
('Parejas', 'couples'),
('Aventura', 'adventure'),
('Frente a la playa', 'beachfront'),
('Deportes acuáticos', 'water-sports'),
('Bienestar', 'wellness'),
('Patrimonio cultural', 'cultural-heritage'),
('Eco-friendly', 'eco-friendly'),
('Todo incluido', 'all-inclusive');

-- Insert travel packages
INSERT INTO public.travel_packages (
  title, description, summary, base_price, currency, destination, duration, 
  tags, is_featured, is_published, rating, availability_count,
  gallery, itinerary, pricing_tiers
) VALUES
(
  '{"es": "Paraíso de Playa del Carmen", "en": "Playa del Carmen Paradise"}',
  '{"es": "Experimenta las playas prístinas y la cultura vibrante de Playa del Carmen con alojamientos de lujo frente a la playa y experiencias mexicanas auténticas.", "en": "Experience the pristine beaches and vibrant culture of Playa del Carmen with luxury beachfront accommodations and authentic Mexican experiences."}',
  '{"es": "4 días de lujo frente al mar con tours culturales incluidos", "en": "4 days of luxury beachfront with cultural tours included"}',
  1299, 'USD', 'Playa del Carmen', 4,
  ARRAY['luxury', 'couples', 'beachfront'],
  true, true, 4.8, 12,
  '{"images": ["/api/placeholder/800/600", "/api/placeholder/800/600"]}',
  '[
    {"title": "Día 1", "description": "Llegada y check-in en resort frente a la playa, cena de bienvenida", "highlights": ["Resort de lujo", "Cena romántica"]},
    {"title": "Día 2", "description": "Exploración del Cenote Dos Ojos y snorkel", "highlights": ["Cenote único", "Actividades acuáticas"]},
    {"title": "Día 3", "description": "Tour de ruinas mayas de Tulum con guía local", "highlights": ["Historia maya", "Guía experto"]},
    {"title": "Día 4", "description": "Día de spa y cena de despedida en la playa", "highlights": ["Relajación", "Vista al mar"]}
  ]',
  '{"premium": {"price": 1599, "description": "Incluye suite con vista al mar y servicios VIP", "includes": ["Suite premium", "Mayordomo personal", "Excursiones privadas"]}}'
),
(
  '{"es": "Semana de Aventura en Cancún", "en": "Cancún Adventure Week"}',
  '{"es": "Semana llena de acción explorando las mejores actividades de aventura de Cancún, desde expediciones en la selva hasta buceo en arrecifes submarinos.", "en": "Action-packed week exploring Cancún''s best adventure activities from jungle expeditions to underwater reef diving."}',
  '{"es": "7 días de aventura extrema con buceo y exploración", "en": "7 days of extreme adventure with diving and exploration"}',
  1899, 'USD', 'Cancún', 7,
  ARRAY['family', 'adventure', 'water-sports'],
  false, true, 4.7, 8,
  '{"images": ["/api/placeholder/800/600", "/api/placeholder/800/600"]}',
  '[
    {"title": "Días 1-2", "description": "Buceo y snorkel en el Arrecife Mesoamericano", "highlights": ["Arrecife mundial", "Vida marina"]},
    {"title": "Días 3-4", "description": "Tours a Chichen Itzá y cenotes", "highlights": ["Maravilla del mundo", "Cenotes sagrados"]},
    {"title": "Días 5-6", "description": "Tirolesas en la selva y aventuras en ATV", "highlights": ["Adrenalina pura", "Selva tropical"]},
    {"title": "Día 7", "description": "Parque eco Xel-Há y espectáculos culturales", "highlights": ["Eco-parque", "Cultura viva"]}
  ]',
  '{"family": {"price": 1599, "description": "Precio especial para familias con niños", "includes": ["Descuento familiar", "Actividades para niños", "Seguro de viaje"]}}'
),
(
  '{"es": "Retiro Místico de Tulum", "en": "Tulum Mystical Retreat"}',
  '{"es": "Conéctate con la sabiduría maya ancestral en este retiro transformador de bienestar que incluye yoga, meditación y ceremonias tradicionales de temazcal.", "en": "Connect with ancient Mayan wisdom in this transformative wellness retreat featuring yoga, meditation, and traditional temazcal ceremonies."}',
  '{"es": "5 días de bienestar espiritual y conexión ancestral", "en": "5 days of spiritual wellness and ancestral connection"}',
  1650, 'USD', 'Tulum', 5,
  ARRAY['wellness', 'couples', 'eco-friendly'],
  true, true, 4.9, 6,
  '{"images": ["/api/placeholder/800/600", "/api/placeholder/800/600"]}',
  '[
    {"title": "Día 1", "description": "Llegada y yoga al amanecer en la playa", "highlights": ["Yoga frente al mar", "Amanecer mágico"]},
    {"title": "Día 2", "description": "Tour de ruinas de Tulum y meditación en cenote", "highlights": ["Ruinas icónicas", "Meditación profunda"]},
    {"title": "Día 3", "description": "Ceremonia tradicional de temazcal y sanación maya", "highlights": ["Ritual ancestral", "Sanación holística"]},
    {"title": "Día 4", "description": "Eco-tour de la Reserva de la Biosfera Sian Ka''an", "highlights": ["Naturaleza virgen", "Ecosistema único"]},
    {"title": "Día 5", "description": "Partida con plan de bienestar personalizado", "highlights": ["Plan personal", "Continuidad en casa"]}
  ]',
  '{"premium": {"price": 2150, "description": "Incluye temazcal privado y tratamientos de spa premium", "includes": ["Temazcal privado", "Spa de lujo", "Sanador personal"]}}'
),
(
  '{"es": "Expedición de Buceo en Cozumel", "en": "Cozumel Diving Expedition"}',
  '{"es": "Explora los mundialmente famosos arrecifes de Cozumel con maestros de buceo profesionales en esta expedición de fotografía submarina.", "en": "Explore the world-famous Cozumel reefs with professional dive masters on this underwater photography expedition."}',
  '{"es": "5 días de buceo profesional en el mejor arrecife del mundo", "en": "5 days of professional diving in the world''s best reef"}',
  2100, 'USD', 'Cozumel', 5,
  ARRAY['diving', 'adventure', 'couples'],
  false, true, 4.8, 10,
  '{"images": ["/api/placeholder/800/600", "/api/placeholder/800/600"]}',
  '[
    {"title": "Día 1", "description": "Llegada y buceos de verificación en Arrecife Paradise", "highlights": ["Buceos de práctica", "Familiarización"]},
    {"title": "Día 2", "description": "Buceos en Arrecife Palancar y Pared Santa Rosa", "highlights": ["Arrecifes icónicos", "Formaciones coralinas"]},
    {"title": "Día 3", "description": "Exploración de Garganta del Diablo y Punta Sur", "highlights": ["Sitio legendario", "Corrientes emocionantes"]},
    {"title": "Día 4", "description": "Buceo nocturno y taller de fotografía submarina", "highlights": ["Vida nocturna marina", "Fotografía profesional"]},
    {"title": "Día 5", "description": "Buceo avanzado en naufragio C-53 Felipe Xicotencatl", "highlights": ["Buceo en naufragio", "Historia submarina"]}
  ]',
  '{"pro": {"price": 2600, "description": "Incluye equipo profesional y sesiones de fotografía privadas", "includes": ["Cámara profesional", "Instructor privado", "Edición de fotos"]}}'
),
(
  '{"es": "Inmersión Cultural en Mérida", "en": "Mérida Cultural Immersion"}',
  '{"es": "Descubre el encanto colonial y la herencia maya de Mérida con guías locales expertos y experiencias culinarias auténticas.", "en": "Discover the colonial charm and Mayan heritage of Mérida with expert local guides and authentic culinary experiences."}',
  '{"es": "5 días de cultura profunda y gastronomía yucateca", "en": "5 days of deep culture and Yucatecan gastronomy"}',
  1450, 'USD', 'Mérida', 5,
  ARRAY['cultural-heritage', 'family', 'wellness'],
  false, true, 4.6, 15,
  '{"images": ["/api/placeholder/800/600", "/api/placeholder/800/600"]}',
  '[
    {"title": "Día 1", "description": "Tour a pie del centro histórico y Casa de Montejo", "highlights": ["Arquitectura colonial", "Historia viva"]},
    {"title": "Día 2", "description": "Sitio arqueológico de Uxmal y visita a hacienda tradicional", "highlights": ["Ruinas mayas", "Hacienda auténtica"]},
    {"title": "Día 3", "description": "Clase de cocina con especialidades yucatecas", "highlights": ["Cocina tradicional", "Chef local"]},
    {"title": "Día 4", "description": "Reserva de flamencos de Celestún y tour de manglares", "highlights": ["Flamencos rosados", "Ecosistema único"]},
    {"title": "Día 5", "description": "Talleres de artesanos y exploración del mercado local", "highlights": ["Artesanías únicas", "Mercado tradicional"]}
  ]',
  '{"deluxe": {"price": 1850, "description": "Incluye alojamiento en hacienda histórica", "includes": ["Hacienda de lujo", "Tours privados", "Cenas gourmet"]}}'
),
(
  '{"es": "Escape de Lujo en Puerto Vallarta", "en": "Puerto Vallarta Luxury Escape"}',
  '{"es": "Disfruta del lujo de clase mundial en los resorts más exclusivos de Puerto Vallarta con acceso privado a la playa y cenas gourmet.", "en": "Indulge in world-class luxury at Puerto Vallarta''s most exclusive resorts with private beach access and gourmet dining."}',
  '{"es": "5 días de lujo absoluto en la costa del Pacífico", "en": "5 days of absolute luxury on the Pacific coast"}',
  2850, 'USD', 'Puerto Vallarta', 5,
  ARRAY['luxury', 'couples', 'all-inclusive'],
  true, true, 4.9, 4,
  '{"images": ["/api/placeholder/800/600", "/api/placeholder/800/600"]}',
  '[
    {"title": "Día 1", "description": "Llegada VIP y check-in en suite de lujo", "highlights": ["Servicio VIP", "Suite frente al mar"]},
    {"title": "Día 2", "description": "Excursión privada en yate a las Islas Marietas", "highlights": ["Yate privado", "Playa escondida"]},
    {"title": "Día 3", "description": "Día de spa con tratamientos tradicionales mexicanos", "highlights": ["Spa de lujo", "Tratamientos ancestrales"]},
    {"title": "Día 4", "description": "Tour de cata de tequila en destilerías cercanas", "highlights": ["Tequila premium", "Destilerías artesanales"]},
    {"title": "Día 5", "description": "Cena con chef privado y crucero al atardecer en catamarán", "highlights": ["Chef privado", "Atardecer mágico"]}
  ]',
  '{"royal": {"price": 3850, "description": "Incluye mayordomo personal y excursiones en helicóptero", "includes": ["Mayordomo 24/7", "Vuelos en helicóptero", "Experiencias exclusivas"]}}'
);

-- Insert features
INSERT INTO public.features (name, icon, description) VALUES
('WiFi', 'wifi', 'Acceso a internet inalámbrico de alta velocidad en toda la propiedad'),
('Piscina', 'waves', 'Piscina infinita con vista al océano y servicio de piscina'),
('Restaurante', 'utensils', 'Restaurante gourmet con cocina mexicana auténtica e internacional'),
('Spa y Bienestar', 'flower', 'Spa de servicio completo con tratamientos tradicionales mexicanos de sanación'),
('Acceso a la Playa', 'umbrella-beach', 'Acceso privado a la playa con sillas y sombrillas de cortesía');

-- Insert services
INSERT INTO public.services (name, icon, description) VALUES
('Traslado al Aeropuerto', 'plane', 'Transporte de ida y vuelta al aeropuerto en vehículo de lujo con servicio de recepción'),
('Guía Turístico Privado', 'user-check', 'Guía bilingüe certificado con amplio conocimiento local'),
('Alquiler de Equipos', 'gear', 'Equipo profesional de buceo, snorkel y deportes acuáticos'),
('Servicio de Fotografía', 'camera', 'Fotógrafo profesional para ocasiones especiales y excursiones');

-- Update sequences to avoid conflicts
SELECT setval('destinations_id_seq', (SELECT MAX(id) FROM destinations));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('tags_id_seq', (SELECT MAX(id) FROM tags));
SELECT setval('features_id_seq', (SELECT MAX(id) FROM features));
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));