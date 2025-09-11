-- Create comprehensive travel bookings table for all categories
CREATE TABLE IF NOT EXISTS public.travel_bookings_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('flights', 'hotels', 'insurance', 'cruises', 'airbnb', 'tour_guides', 'charters', 'car_rentals')),
  
  -- Common fields
  title JSONB NOT NULL, -- {es: "", en: ""}
  description JSONB,
  provider_name TEXT,
  location TEXT,
  price_amount DECIMAL(10,2),
  price_currency TEXT DEFAULT 'MXN',
  scenario_tags TEXT[],
  featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  is_demo BOOLEAN DEFAULT false,
  
  -- Category-specific data stored in JSONB
  category_data JSONB NOT NULL DEFAULT '{}',
  
  -- Booking management
  availability INTEGER DEFAULT 0,
  booking_window JSONB, -- {start_date: "", end_date: ""}
  
  -- Metadata
  gallery JSONB DEFAULT '{"images": []}',
  reviews JSONB DEFAULT '{"reviews": [], "rating": 0, "count": 0}',
  
  -- Admin fields
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.travel_bookings_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view published categories" 
ON public.travel_bookings_categories 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can manage all categories" 
ON public.travel_bookings_categories 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create updated_at trigger
CREATE TRIGGER update_travel_bookings_categories_updated_at
    BEFORE UPDATE ON public.travel_bookings_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create user bookings table for actual reservations
CREATE TABLE IF NOT EXISTS public.user_travel_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.travel_bookings_categories(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  
  -- Booking details
  booking_data JSONB NOT NULL, -- stores form data specific to category
  total_amount DECIMAL(10,2),
  booking_dates JSONB, -- {start_date: "", end_date: "", duration: ""}
  
  -- Status tracking
  booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  stripe_session_id TEXT,
  
  -- Contact info
  contact_info JSONB NOT NULL, -- {name: "", email: "", phone: ""}
  special_requests TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for user bookings
ALTER TABLE public.user_travel_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user bookings
CREATE POLICY "Users can view their own bookings" 
ON public.user_travel_bookings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" 
ON public.user_travel_bookings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
ON public.user_travel_bookings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all user bookings" 
ON public.user_travel_bookings 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create updated_at trigger for user bookings
CREATE TRIGGER update_user_travel_bookings_updated_at
    BEFORE UPDATE ON public.user_travel_bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();