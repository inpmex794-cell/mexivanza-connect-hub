-- Update travel_packages table to include more travel-specific fields
ALTER TABLE public.travel_packages 
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS city TEXT, 
ADD COLUMN IF NOT EXISTS scenario_tags TEXT[],
ADD COLUMN IF NOT EXISTS duration INTEGER, -- days
ADD COLUMN IF NOT EXISTS availability INTEGER,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Create travel_bookings table specifically for travel packages
CREATE TABLE IF NOT EXISTS public.travel_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.travel_packages(id) ON DELETE CASCADE,
  traveler_name TEXT NOT NULL,
  traveler_email TEXT NOT NULL,
  traveler_whatsapp TEXT,
  travel_start_date DATE NOT NULL,
  travel_end_date DATE NOT NULL,
  number_of_travelers INTEGER DEFAULT 1,
  special_requests TEXT,
  total_amount DECIMAL(10,2),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled')),
  stripe_session_id TEXT,
  is_demo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on travel_bookings
ALTER TABLE public.travel_bookings ENABLE ROW LEVEL SECURITY;

-- RLS policies for travel_bookings
CREATE POLICY "Users can view their own travel bookings" 
ON public.travel_bookings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create travel bookings" 
ON public.travel_bookings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own travel bookings" 
ON public.travel_bookings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all travel bookings" 
ON public.travel_bookings 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create updated_at trigger for travel_bookings
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_travel_bookings_updated_at
    BEFORE UPDATE ON public.travel_bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

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
);

-- Insert demo bookings
INSERT INTO public.travel_bookings (
  user_id,
  package_id,
  traveler_name,
  traveler_email,
  traveler_whatsapp,
  travel_start_date,
  travel_end_date,
  number_of_travelers,
  special_requests,
  total_amount,
  payment_status,
  booking_status,
  is_demo
) VALUES
(
  (SELECT id FROM auth.users WHERE email = 'mexivanza@mexivanza.com' LIMIT 1),
  (SELECT id FROM public.travel_packages WHERE title->>'es' = 'Tour Ciudades Coloniales' LIMIT 1),
  'María González',
  'maria@example.com',
  '+52 55 1234 5678',
  '2024-12-15',
  '2024-12-19',
  2,
  'Vegetarian meals please',
  30000.00,
  'paid',
  'confirmed',
  true
),
(
  (SELECT id FROM auth.users WHERE email = 'mexivanza@mexivanza.com' LIMIT 1),
  (SELECT id FROM public.travel_packages WHERE title->>'es' = 'Aventura Costa del Pacífico' LIMIT 1),
  'Juan Pérez',
  'juan@example.com',
  '+52 33 9876 5432',
  '2024-12-20',
  '2024-12-26',
  4,
  'Anniversary celebration',
  88000.00,
  'pending',
  'pending',
  true
);