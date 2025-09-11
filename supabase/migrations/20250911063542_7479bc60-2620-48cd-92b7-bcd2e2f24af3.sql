-- Fix category column type conversion issue
-- First drop the default constraint, then change type, then add back proper default

-- For posts table
ALTER TABLE posts ALTER COLUMN category DROP DEFAULT;
ALTER TABLE posts ALTER COLUMN category TYPE TEXT;

-- For user_posts table  
ALTER TABLE user_posts ALTER COLUMN category DROP DEFAULT;
ALTER TABLE user_posts ALTER COLUMN category TYPE TEXT;

-- Create the enum type
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

-- Now safely convert to enum type
ALTER TABLE posts ALTER COLUMN category TYPE post_category USING category::post_category;
ALTER TABLE posts ALTER COLUMN category SET DEFAULT 'News'::post_category;

ALTER TABLE user_posts ALTER COLUMN category TYPE post_category USING category::post_category; 
ALTER TABLE user_posts ALTER COLUMN category SET DEFAULT 'News'::post_category;

-- Add missing columns to user_posts for profile data
ALTER TABLE user_posts ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE user_posts ADD COLUMN IF NOT EXISTS author_avatar TEXT;

-- Rest of the schema updates
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
    updated_at TIMESTAMPTZ DEFAULT now(),
    is_demo BOOLEAN DEFAULT false
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

-- Add demo content flags to existing tables
ALTER TABLE user_posts ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE video_content ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE travel_packages ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE real_estate ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE gaming_content ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;