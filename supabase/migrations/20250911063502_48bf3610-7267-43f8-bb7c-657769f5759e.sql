-- Fix the user_posts table to properly reference profiles
-- Add missing foreign key relationships and update schema

-- Add missing columns to user_posts if not exists
ALTER TABLE user_posts ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE user_posts ADD COLUMN IF NOT EXISTS author_avatar TEXT;

-- Update posts table to include proper category enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_category') THEN
        CREATE TYPE post_category AS ENUM (
            'News', 
            'Fitness', 
            'Cooking', 
            'Travel', 
            'Legal', 
            'Real Estate', 
            'Business', 
            'Web Development', 
            'Events', 
            'Ads'
        );
    END IF;
END
$$;

-- Update posts table category column
ALTER TABLE posts ALTER COLUMN category TYPE post_category USING category::post_category;
ALTER TABLE user_posts ALTER COLUMN category TYPE post_category USING category::post_category;

-- Create verified_agents table for real estate agents
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
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on verified_agents
ALTER TABLE verified_agents ENABLE ROW LEVEL SECURITY;

-- Create policies for verified_agents
CREATE POLICY "Anyone can view verified agents" ON verified_agents
    FOR SELECT USING (is_active = true AND verification_status = 'verified');

CREATE POLICY "Agents can manage own profile" ON verified_agents
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all agents" ON verified_agents
    FOR ALL USING (is_admin(auth.uid()));

-- Create monetization_tiers table
CREATE TABLE IF NOT EXISTS monetization_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tier_name TEXT NOT NULL DEFAULT 'free',
    tier_price NUMERIC DEFAULT 0,
    features JSONB DEFAULT '[]',
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on monetization_tiers
ALTER TABLE monetization_tiers ENABLE ROW LEVEL SECURITY;

-- Create policies for monetization_tiers
CREATE POLICY "Users can view own tier" ON monetization_tiers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all tiers" ON monetization_tiers
    FOR ALL USING (is_admin(auth.uid()));

-- Add demo content flag to relevant tables
ALTER TABLE user_posts ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE video_content ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE travel_packages ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE real_estate ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE gaming_content ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE verified_agents ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Create weather_data table for caching weather info
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

-- Create policy for weather_data
CREATE POLICY "Anyone can view weather data" ON weather_data
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage weather data" ON weather_data
    FOR ALL USING (is_admin(auth.uid()));

-- Update profiles table to include tier information
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_tier TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tier_expires_at TIMESTAMPTZ;

-- Create content_edits table for admin inline editing
CREATE TABLE IF NOT EXISTS content_edits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type TEXT NOT NULL, -- 'post', 'service', 'package', etc.
    content_id TEXT NOT NULL,
    field_name TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    edited_by UUID REFERENCES auth.users(id),
    language TEXT DEFAULT 'es',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on content_edits
ALTER TABLE content_edits ENABLE ROW LEVEL SECURITY;

-- Create policies for content_edits
CREATE POLICY "Admins can manage content edits" ON content_edits
    FOR ALL USING (is_admin(auth.uid()));

-- Create admin_analytics table
CREATE TABLE IF NOT EXISTS admin_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_data JSONB DEFAULT '{}',
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on admin_analytics
ALTER TABLE admin_analytics ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_analytics
CREATE POLICY "Admins can view analytics" ON admin_analytics
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "System can insert analytics" ON admin_analytics
    FOR INSERT WITH CHECK (true);