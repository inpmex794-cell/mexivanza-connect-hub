-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Insert demo travel packages
INSERT INTO public.travel_packages (
  title, 
  description, 
  region, 
  city, 
  scenario_tags, 
  duration, 
  pricing_tiers, 
  itinerary, 
  gallery, 
  availability,
  featured,
  is_published, 
  is_demo, 
  created_by
) VALUES 
(
  '{"es": "Tour Ciudades Coloniales", "en": "Colonial Cities Tour"}',
  '{"es": "Descubre la rica historia colonial de México visitando las ciudades más emblemáticas", "en": "Discover Mexico''s rich colonial history visiting the most emblematic cities"}',
  'Central Mexico',
  'Puebla',
  ARRAY['cultural', 'historical', 'architecture'],
  5,
  '{"standard": {"price": 15000, "currency": "MXN", "includes": ["Transport", "Guide", "Meals"]}, "premium": {"price": 25000, "currency": "MXN", "includes": ["Transport", "Guide", "Meals", "Hotels", "Museums"]}}',
  '{"days": [
    {"day": 1, "title": {"es": "Llegada a Puebla", "en": "Arrival in Puebla"}, "activities": {"es": "Check-in hotel, tour centro histórico", "en": "Hotel check-in, historic center tour"}},
    {"day": 2, "title": {"es": "Cholula y Pirámides", "en": "Cholula and Pyramids"}, "activities": {"es": "Visita a la Gran Pirámide de Cholula", "en": "Visit to the Great Pyramid of Cholula"}},
    {"day": 3, "title": {"es": "Tlaxcala", "en": "Tlaxcala"}, "activities": {"es": "Explorar Tlaxcala y sus murales", "en": "Explore Tlaxcala and its murals"}},
    {"day": 4, "title": {"es": "Oaxaca", "en": "Oaxaca"}, "activities": {"es": "Viaje a Oaxaca, centro histórico", "en": "Travel to Oaxaca, historic center"}},
    {"day": 5, "title": {"es": "Regreso", "en": "Return"}, "activities": {"es": "Monte Albán y regreso", "en": "Monte Albán and return"}}
  ]}',
  '{"images": [
    {"url": "/placeholder.svg", "caption": {"es": "Centro histórico de Puebla", "en": "Historic center of Puebla"}},
    {"url": "/placeholder.svg", "caption": {"es": "Gran Pirámide de Cholula", "en": "Great Pyramid of Cholula"}}
  ]}',
  20,
  true,
  true,
  true,
  (SELECT id FROM auth.users WHERE email = 'mexivanza@mexivanza.com' LIMIT 1)
),
(
  '{"es": "Aventura Costa del Pacífico", "en": "Pacific Coast Adventure"}',
  '{"es": "Experimenta las mejores playas y actividades acuáticas del Pacífico mexicano", "en": "Experience the best beaches and water activities of the Mexican Pacific"}',
  'Pacific Coast',
  'Puerto Vallarta',
  ARRAY['beach', 'adventure', 'water_sports'],
  7,
  '{"standard": {"price": 22000, "currency": "MXN", "includes": ["Transport", "Accommodation", "Activities"]}, "premium": {"price": 35000, "currency": "MXN", "includes": ["Transport", "Luxury Hotel", "All Activities", "Meals", "Spa"]}}',
  '{"days": [
    {"day": 1, "title": {"es": "Llegada Puerto Vallarta", "en": "Arrival Puerto Vallarta"}, "activities": {"es": "Check-in resort, playa libre", "en": "Resort check-in, free beach time"}},
    {"day": 2, "title": {"es": "Snorkel en Islas Marietas", "en": "Snorkeling at Marietas Islands"}, "activities": {"es": "Tour de snorkel y playa escondida", "en": "Snorkeling tour and hidden beach"}},
    {"day": 3, "title": {"es": "Sayulita", "en": "Sayulita"}, "activities": {"es": "Visita a Sayulita, surf y cultura", "en": "Visit Sayulita, surf and culture"}},
    {"day": 4, "title": {"es": "Aventura en la Selva", "en": "Jungle Adventure"}, "activities": {"es": "Canopy, tirolinas y cascadas", "en": "Canopy, zip lines and waterfalls"}},
    {"day": 5, "title": {"es": "Buceo en Los Arcos", "en": "Diving at Los Arcos"}, "activities": {"es": "Buceo certificado en Los Arcos", "en": "Certified diving at Los Arcos"}},
    {"day": 6, "title": {"es": "Tequila Tour", "en": "Tequila Tour"}, "activities": {"es": "Tour por destilerías de tequila", "en": "Tequila distillery tour"}},
    {"day": 7, "title": {"es": "Regreso", "en": "Return"}, "activities": {"es": "Último día de playa y regreso", "en": "Last beach day and return"}}
  ]}',
  '{"images": [
    {"url": "/placeholder.svg", "caption": {"es": "Playa de Puerto Vallarta", "en": "Puerto Vallarta Beach"}},
    {"url": "/placeholder.svg", "caption": {"es": "Islas Marietas", "en": "Marietas Islands"}}
  ]}',
  15,
  true,
  true,
  true,
  (SELECT id FROM auth.users WHERE email = 'mexivanza@mexivanza.com' LIMIT 1)
),
(
  '{"es": "Explorador de Ruinas Mayas", "en": "Mayan Ruins Explorer"}',
  '{"es": "Sumérgete en la fascinante civilización maya visitando los sitios arqueológicos más importantes", "en": "Immerse yourself in the fascinating Mayan civilization visiting the most important archaeological sites"}',
  'Yucatan Peninsula',
  'Mérida',
  ARRAY['archaeological', 'cultural', 'historical'],
  6,
  '{"standard": {"price": 18000, "currency": "MXN", "includes": ["Transport", "Guide", "Entrances"]}, "premium": {"price": 28000, "currency": "MXN", "includes": ["Transport", "Expert Guide", "Entrances", "Hotels", "Traditional Meals"]}}',
  '{"days": [
    {"day": 1, "title": {"es": "Llegada a Mérida", "en": "Arrival in Mérida"}, "activities": {"es": "Tour por el centro histórico de Mérida", "en": "Historic center tour of Mérida"}},
    {"day": 2, "title": {"es": "Chichén Itzá", "en": "Chichen Itza"}, "activities": {"es": "Visita a Chichén Itzá y cenote Ik Kil", "en": "Visit Chichen Itza and Ik Kil cenote"}},
    {"day": 3, "title": {"es": "Uxmal", "en": "Uxmal"}, "activities": {"es": "Explorar Uxmal y ruta Puuc", "en": "Explore Uxmal and Puuc route"}},
    {"day": 4, "title": {"es": "Coba y Tulum", "en": "Coba and Tulum"}, "activities": {"es": "Coba y Tulum con playa", "en": "Coba and Tulum with beach"}},
    {"day": 5, "title": {"es": "Ek Balam", "en": "Ek Balam"}, "activities": {"es": "Ek Balam y cenote Maya", "en": "Ek Balam and Maya cenote"}},
    {"day": 6, "title": {"es": "Regreso", "en": "Return"}, "activities": {"es": "Mercado de artesanías y regreso", "en": "Handicraft market and return"}}
  ]}',
  '{"images": [
    {"url": "/placeholder.svg", "caption": {"es": "Chichén Itzá", "en": "Chichen Itza"}},
    {"url": "/placeholder.svg", "caption": {"es": "Cenote sagrado", "en": "Sacred cenote"}}
  ]}',
  12,
  false,
  true,
  true,
  (SELECT id FROM auth.users WHERE email = 'mexivanza@mexivanza.com' LIMIT 1)
) ON CONFLICT DO NOTHING;