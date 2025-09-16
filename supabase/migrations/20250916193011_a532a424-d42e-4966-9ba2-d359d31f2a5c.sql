-- Create travel_extras table
CREATE TABLE IF NOT EXISTS public.travel_extras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES public.travel_packages(id) ON DELETE CASCADE,
  name JSONB NOT NULL, -- {"es": "name", "en": "name"}
  description JSONB, -- {"es": "desc", "en": "desc"}
  price NUMERIC NOT NULL DEFAULT 0,
  per_person BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create travel_availability table
CREATE TABLE IF NOT EXISTS public.travel_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES public.travel_packages(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 10,
  reserved INTEGER NOT NULL DEFAULT 0,
  price_override NUMERIC, -- NULL means use base package price
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(package_id, date)
);

-- Add missing columns to travel_packages
ALTER TABLE public.travel_packages 
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS destination TEXT,
ADD COLUMN IF NOT EXISTS summary JSONB,
ADD COLUMN IF NOT EXISTS description_md JSONB,
ADD COLUMN IF NOT EXISTS images TEXT[],
ADD COLUMN IF NOT EXISTS duration_days INTEGER,
ADD COLUMN IF NOT EXISTS base_price NUMERIC,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'MXN',
ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 4.5,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS availability_count INTEGER DEFAULT 10;

-- Enhance travel_bookings table
ALTER TABLE public.travel_bookings
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS travelers JSONB,
ADD COLUMN IF NOT EXISTS extras JSONB,
ADD COLUMN IF NOT EXISTS subtotal NUMERIC,
ADD COLUMN IF NOT EXISTS fees NUMERIC,
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'stripe',
ADD COLUMN IF NOT EXISTS booked_for_date DATE;

-- Create booking status enum
DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'paid', 'canceled', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Update travel_bookings status column to use enum
ALTER TABLE public.travel_bookings 
ALTER COLUMN status TYPE booking_status USING status::booking_status;

-- Enable RLS on new tables
ALTER TABLE public.travel_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies for travel_extras
CREATE POLICY "Anyone can view active extras" ON public.travel_extras
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage extras" ON public.travel_extras
FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for travel_availability  
CREATE POLICY "Anyone can view availability" ON public.travel_availability
FOR SELECT USING (is_active = true AND date >= CURRENT_DATE);

CREATE POLICY "Admins can manage availability" ON public.travel_availability
FOR ALL USING (is_admin(auth.uid()));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_travel_extras_package_id ON public.travel_extras(package_id);
CREATE INDEX IF NOT EXISTS idx_travel_availability_package_date ON public.travel_availability(package_id, date);
CREATE INDEX IF NOT EXISTS idx_travel_packages_featured ON public.travel_packages(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_travel_packages_destination ON public.travel_packages(destination);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_travel_extras_updated_at 
BEFORE UPDATE ON public.travel_extras 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed sample Mexico travel packages
INSERT INTO public.travel_packages (
  title, slug, destination, summary, description_md, images, duration_days, 
  base_price, currency, rating, tags, is_featured, availability_count, featured,
  region, city, scenario_tags, duration, availability, is_published, created_by
) VALUES 
(
  '{"es": "Oaxaca Cultural y Gastronómica", "en": "Oaxaca Cultural and Gastronomic"}',
  'oaxaca-cultural-gastronomica',
  'Oaxaca',
  '{"es": "Descubre la riqueza cultural y gastronómica de Oaxaca", "en": "Discover the cultural and gastronomic richness of Oaxaca"}',
  '{"es": "# Oaxaca Cultural\n\nExplora los tesoros de Oaxaca, desde sus mercados coloridos hasta sus tradiciones ancestrales.", "en": "# Cultural Oaxaca\n\nExplore the treasures of Oaxaca, from its colorful markets to its ancestral traditions."}',
  ARRAY['/images/oaxaca-1.jpg', '/images/oaxaca-2.jpg'],
  4, 8500, 'MXN', 4.8, ARRAY['cultura', 'gastronomía', 'tradiciones'], true, 12, true,
  'Sur', 'Oaxaca de Juárez', ARRAY['cultural', 'food'], 4, 12, true, 
  (SELECT id FROM auth.users WHERE email = 'mexivanza@mexivanza.com' LIMIT 1)
),
(
  '{"es": "CDMX: Historia y Modernidad", "en": "Mexico City: History and Modernity"}',
  'cdmx-historia-modernidad', 
  'Ciudad de México',
  '{"es": "Recorre la capital mexicana entre historia y vanguardia", "en": "Tour the Mexican capital between history and avant-garde"}',
  '{"es": "# Ciudad de México\n\nUn viaje único por la capital que combina sitios arqueológicos, museos de clase mundial y gastronomía contemporánea.", "en": "# Mexico City\n\nA unique journey through the capital that combines archaeological sites, world-class museums and contemporary gastronomy."}',
  ARRAY['/images/cdmx-1.jpg', '/images/cdmx-2.jpg'],
  3, 6200, 'MXN', 4.6, ARRAY['historia', 'museos', 'arqueología'], true, 15, true,
  'Centro', 'Ciudad de México', ARRAY['historical', 'museums'], 3, 15, true,
  (SELECT id FROM auth.users WHERE email = 'mexivanza@mexivanza.com' LIMIT 1)
),
(
  '{"es": "Yucatán Místico: Cenotes y Pirámides", "en": "Mystical Yucatan: Cenotes and Pyramids"}',
  'yucatan-cenotes-piramides',
  'Yucatán', 
  '{"es": "Aventura maya entre cenotes cristalinos y pirámides milenarias", "en": "Mayan adventure between crystal cenotes and millenary pyramids"}',
  '{"es": "# Yucatán Místico\n\nSumérgete en la cultura maya visitando Chichén Itzá, cenotes sagrados y pueblos coloniales.", "en": "# Mystical Yucatan\n\nImmerse yourself in Mayan culture by visiting Chichen Itza, sacred cenotes and colonial towns."}',
  ARRAY['/images/yucatan-1.jpg', '/images/yucatan-2.jpg'],
  5, 12800, 'MXN', 4.9, ARRAY['maya', 'cenotes', 'arqueología'], true, 8, true,
  'Sureste', 'Mérida', ARRAY['adventure', 'cultural'], 5, 8, true,
  (SELECT id FROM auth.users WHERE email = 'mexivanza@mexivanza.com' LIMIT 1)
);

-- Seed travel extras
INSERT INTO public.travel_extras (package_id, name, description, price, per_person, is_active) 
SELECT 
  tp.id,
  '{"es": "Seguro de viaje premium", "en": "Premium travel insurance"}',
  '{"es": "Cobertura completa para tu tranquilidad", "en": "Complete coverage for your peace of mind"}',
  450,
  true,
  true
FROM public.travel_packages tp
WHERE tp.slug IN ('oaxaca-cultural-gastronomica', 'cdmx-historia-modernidad', 'yucatan-cenotes-piramides');

-- Seed travel availability (next 30 days)
INSERT INTO public.travel_availability (package_id, date, capacity, reserved)
SELECT 
  tp.id,
  CURRENT_DATE + INTERVAL '1 day' * generate_series(1, 30),
  CASE 
    WHEN tp.slug = 'yucatan-cenotes-piramides' THEN 8
    WHEN tp.slug = 'oaxaca-cultural-gastronomica' THEN 12  
    ELSE 15
  END,
  FLOOR(RANDOM() * 3)
FROM public.travel_packages tp
WHERE tp.slug IN ('oaxaca-cultural-gastronomica', 'cdmx-historia-modernidad', 'yucatan-cenotes-piramides');