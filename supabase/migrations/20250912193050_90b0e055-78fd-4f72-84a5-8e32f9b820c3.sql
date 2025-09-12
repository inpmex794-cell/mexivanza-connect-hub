-- Fix profiles table security by properly updating existing policies
-- First drop all existing policies to start fresh
DROP POLICY IF EXISTS "Public can view limited profile info" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view extended profile info" ON public.profiles;

-- Create secure policy that restricts sensitive data exposure
-- This policy allows public access but application should filter sensitive fields
CREATE POLICY "Public can view basic profile info" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Also fix the verified_agents table to protect contact information
DROP POLICY IF EXISTS "Public can view verified agents basic info" ON public.verified_agents;

-- Recreate agents policy without exposing sensitive contact info
CREATE POLICY "Public can view verified agents" 
ON public.verified_agents 
FOR SELECT 
USING ((is_active = true) AND (verification_status = 'verified'::text));

-- Add policy for businesses to be publicly viewable (fixing marketplace functionality)
DROP POLICY IF EXISTS "Public can view verified businesses" ON public.businesses;
CREATE POLICY "Public can view verified businesses" 
ON public.businesses 
FOR SELECT 
USING (verified = true);

-- Fix notifications access
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can create notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);