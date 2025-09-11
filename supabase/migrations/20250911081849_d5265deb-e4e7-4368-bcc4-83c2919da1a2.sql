-- Update travel_packages table to include more travel-specific fields
ALTER TABLE public.travel_packages 
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS city TEXT, 
ADD COLUMN IF NOT EXISTS scenario_tags TEXT[],
ADD COLUMN IF NOT EXISTS duration INTEGER, -- days
ADD COLUMN IF NOT EXISTS availability INTEGER,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own travel bookings" ON public.travel_bookings;
DROP POLICY IF EXISTS "Users can create travel bookings" ON public.travel_bookings;
DROP POLICY IF EXISTS "Users can update their own travel bookings" ON public.travel_bookings;
DROP POLICY IF EXISTS "Admins can manage all travel bookings" ON public.travel_bookings;

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

-- Create updated_at trigger for travel_bookings if not exists
DROP TRIGGER IF EXISTS update_travel_bookings_updated_at ON public.travel_bookings;

CREATE TRIGGER update_travel_bookings_updated_at
    BEFORE UPDATE ON public.travel_bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();