-- Insert test accounts for different roles
-- Note: These are for testing purposes and should have secure passwords in production

-- Insert admin test profile if not exists
INSERT INTO public.profiles (id, name, profile_type, verification_status, language_preference)
SELECT 'a0000000-0000-0000-0000-000000000001'::uuid, 
       'Admin Test User', 
       'business', 
       'verified', 
       'en'
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE id = 'a0000000-0000-0000-0000-000000000001'::uuid
);

-- Insert verified test profile if not exists
INSERT INTO public.profiles (id, name, profile_type, verification_status, language_preference)
SELECT 'a0000000-0000-0000-0000-000000000002'::uuid, 
       'Verified Test User', 
       'business', 
       'verified', 
       'es'
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE id = 'a0000000-0000-0000-0000-000000000002'::uuid
);

-- Insert guest test profile if not exists
INSERT INTO public.profiles (id, name, profile_type, verification_status, language_preference)
SELECT 'a0000000-0000-0000-0000-000000000003'::uuid, 
       'Guest Test User', 
       'personal', 
       'unverified', 
       'es'
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE id = 'a0000000-0000-0000-0000-000000000003'::uuid
);

-- Insert test user roles
INSERT INTO public.user_roles (user_id, role)
SELECT 'a0000000-0000-0000-0000-000000000001'::uuid, 'admin'::app_role
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = 'a0000000-0000-0000-0000-000000000001'::uuid
);

INSERT INTO public.user_roles (user_id, role)
SELECT 'a0000000-0000-0000-0000-000000000002'::uuid, 'verified'::app_role
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = 'a0000000-0000-0000-0000-000000000002'::uuid
);

INSERT INTO public.user_roles (user_id, role)
SELECT 'a0000000-0000-0000-0000-000000000003'::uuid, 'user'::app_role
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = 'a0000000-0000-0000-0000-000000000003'::uuid
);

-- Create function to check if user is mexivanza admin
CREATE OR REPLACE FUNCTION public.is_mexivanza_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = _user_id 
    AND email = 'mexivanza@mexivanza.com'
  ) OR public.has_role(_user_id, 'admin');
$$;

-- Update RLS policies to use the new admin check function
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.is_mexivanza_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all applications" ON public.trademark_applications;
CREATE POLICY "Admins can view all applications" 
ON public.trademark_applications 
FOR ALL 
USING (public.is_mexivanza_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage legal services" ON public.legal_services;
CREATE POLICY "Admins can manage legal services" 
ON public.legal_services 
FOR ALL 
USING (public.is_mexivanza_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage templates" ON public.legal_templates;
CREATE POLICY "Admins can manage templates" 
ON public.legal_templates 
FOR ALL 
USING (public.is_mexivanza_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage packages" ON public.travel_packages;
CREATE POLICY "Admins can manage packages" 
ON public.travel_packages 
FOR ALL 
USING (public.is_mexivanza_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all agents" ON public.verified_agents;
CREATE POLICY "Admins can manage all agents" 
ON public.verified_agents 
FOR ALL 
USING (public.is_mexivanza_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage web dev services" ON public.web_dev_services;
CREATE POLICY "Admins can manage web dev services" 
ON public.web_dev_services 
FOR ALL 
USING (public.is_mexivanza_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage weather data" ON public.weather_data;
CREATE POLICY "Admins can manage weather data" 
ON public.weather_data 
FOR ALL 
USING (public.is_mexivanza_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can moderate all posts" ON public.user_posts;
CREATE POLICY "Admins can moderate all posts" 
ON public.user_posts 
FOR ALL 
USING (public.is_mexivanza_admin(auth.uid()));

-- Create admin-only access policy for sensitive operations
CREATE OR REPLACE FUNCTION public.enforce_admin_access()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_mexivanza_admin(auth.uid());
$$;