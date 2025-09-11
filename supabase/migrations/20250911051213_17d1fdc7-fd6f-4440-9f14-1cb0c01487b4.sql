-- Enable business verification and enhance existing business table
ALTER TABLE public.businesses DROP COLUMN IF EXISTS documents;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.00;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS verification_documents JSONB;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS payment_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS template_enabled BOOLEAN DEFAULT false;

-- Create business reviews table
CREATE TABLE IF NOT EXISTS public.business_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id BIGINT REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create ads table
CREATE TABLE IF NOT EXISTS public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id BIGINT REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
  business_id BIGINT REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
  business_id BIGINT REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create RLS policies for business reviews
CREATE POLICY "Anyone can view reviews" ON public.business_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.business_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.business_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.business_reviews FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for ads
CREATE POLICY "Anyone can view active ads" ON public.ads FOR SELECT USING (status = 'active' AND expires_at > now());
CREATE POLICY "Users can create ads" ON public.ads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ads" ON public.ads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ads" ON public.ads FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for real estate
CREATE POLICY "Anyone can view active listings" ON public.real_estate FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create listings" ON public.real_estate FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own listings" ON public.real_estate FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own listings" ON public.real_estate FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for gaming content
CREATE POLICY "Anyone can view gaming content" ON public.gaming_content FOR SELECT USING (true);
CREATE POLICY "Users can create gaming content" ON public.gaming_content FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own gaming content" ON public.gaming_content FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own gaming content" ON public.gaming_content FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for financial data (read-only for users)
CREATE POLICY "Anyone can view financial data" ON public.financial_data FOR SELECT USING (true);

-- Create RLS policies for video content
CREATE POLICY "Anyone can view video content" ON public.video_content FOR SELECT USING (true);
CREATE POLICY "Users can create video content" ON public.video_content FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own video content" ON public.video_content FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own video content" ON public.video_content FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_reviews_business_id ON public.business_reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_business_reviews_rating ON public.business_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_ads_category ON public.ads(category);
CREATE INDEX IF NOT EXISTS idx_ads_location ON public.ads(location);
CREATE INDEX IF NOT EXISTS idx_ads_expires_at ON public.ads(expires_at);
CREATE INDEX IF NOT EXISTS idx_real_estate_location ON public.real_estate(location);
CREATE INDEX IF NOT EXISTS idx_real_estate_price ON public.real_estate(price);
CREATE INDEX IF NOT EXISTS idx_real_estate_property_type ON public.real_estate(property_type);
CREATE INDEX IF NOT EXISTS idx_gaming_content_platform ON public.gaming_content(platform);
CREATE INDEX IF NOT EXISTS idx_financial_data_symbol ON public.financial_data(symbol);
CREATE INDEX IF NOT EXISTS idx_video_content_category ON public.video_content(category);

-- Update function to calculate business ratings
CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.businesses 
  SET 
    rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM public.business_reviews WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)),
    review_count = (SELECT COUNT(*) FROM public.business_reviews WHERE business_id = COALESCE(NEW.business_id, OLD.business_id))
  WHERE id = COALESCE(NEW.business_id, OLD.business_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update business ratings
DROP TRIGGER IF EXISTS update_business_rating_trigger ON public.business_reviews;
CREATE TRIGGER update_business_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.business_reviews
  FOR EACH ROW EXECUTE FUNCTION update_business_rating();