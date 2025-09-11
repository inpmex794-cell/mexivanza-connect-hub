-- First, let's add the missing columns to businesses table
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.00;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS verification_documents JSONB;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS payment_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS template_enabled BOOLEAN DEFAULT false;

-- Create business reviews table without foreign key constraint for now
CREATE TABLE IF NOT EXISTS public.business_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id BIGINT,
  user_id UUID,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create ads table
CREATE TABLE IF NOT EXISTS public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id BIGINT,
  user_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT NOT NULL,
  location TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'MXN',
  expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create real estate listings table
CREATE TABLE IF NOT EXISTS public.real_estate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id BIGINT,
  user_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'MXN',
  bedrooms INTEGER,
  bathrooms INTEGER,
  square_meters DECIMAL(10,2),
  location TEXT NOT NULL,
  coordinates POINT,
  images JSONB,
  features JSONB,
  contact_info JSONB,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create gaming content table
CREATE TABLE IF NOT EXISTS public.gaming_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  game_type TEXT,
  platform TEXT,
  image_url TEXT,
  video_url TEXT,
  trailer_url TEXT,
  rating DECIMAL(3,2),
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create financial data table for Bolsa de Valores
CREATE TABLE IF NOT EXISTS public.financial_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  current_price DECIMAL(15,4),
  change_amount DECIMAL(15,4),
  change_percent DECIMAL(8,4),
  volume BIGINT,
  market_cap BIGINT,
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create video content table for streaming
CREATE TABLE IF NOT EXISTS public.video_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id BIGINT,
  user_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER,
  category TEXT,
  is_live BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.business_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_estate ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gaming_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_content ENABLE ROW LEVEL SECURITY;