-- Complete the schema setup after fixing the category type issue
-- First ensure we have all necessary tables and columns

-- Create the verified_agents table if it doesn't exist
CREATE TABLE IF NOT EXISTS verified_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    region TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    license_number TEXT,
    verification_status TEXT DEFAULT 'pending',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    is_demo BOOLEAN DEFAULT false
);

-- Enable RLS on verified_agents if not already enabled
ALTER TABLE verified_agents ENABLE ROW LEVEL SECURITY;

-- Create policies for verified_agents if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'verified_agents' 
        AND policyname = 'Anyone can view verified agents'
    ) THEN
        CREATE POLICY "Anyone can view verified agents" ON verified_agents
            FOR SELECT USING (is_active = true AND verification_status = 'verified');
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'verified_agents' 
        AND policyname = 'Agents can manage own profile'
    ) THEN
        CREATE POLICY "Agents can manage own profile" ON verified_agents
            FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'verified_agents' 
        AND policyname = 'Admins can manage all agents'
    ) THEN
        CREATE POLICY "Admins can manage all agents" ON verified_agents
            FOR ALL USING (is_admin(auth.uid()));
    END IF;
END $$;

-- Create weather_data table
CREATE TABLE IF NOT EXISTS weather_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location TEXT NOT NULL,
    coordinates POINT,
    current_weather JSONB NOT NULL,
    forecast JSONB,
    alerts JSONB DEFAULT '[]',
    language TEXT DEFAULT 'es',
    last_updated TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on weather_data
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;

-- Create policies for weather_data
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'weather_data' 
        AND policyname = 'Anyone can view weather data'
    ) THEN
        CREATE POLICY "Anyone can view weather data" ON weather_data
            FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'weather_data' 
        AND policyname = 'Admins can manage weather data'
    ) THEN
        CREATE POLICY "Admins can manage weather data" ON weather_data
            FOR ALL USING (is_admin(auth.uid()));
    END IF;
END $$;

-- Add demo flags to existing tables
ALTER TABLE user_posts ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE video_content ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE travel_packages ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE real_estate ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE gaming_content ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;