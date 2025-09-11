-- Create comprehensive Mexivanza platform tables

-- Admin roles and permissions
CREATE TYPE app_role AS ENUM ('admin', 'verified', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Travel packages (admin-only creation)
CREATE TABLE public.travel_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title jsonb NOT NULL, -- multilingual
  description jsonb NOT NULL, -- multilingual
  itinerary jsonb,
  gallery jsonb,
  pricing_tiers jsonb,
  is_published boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Legal services (admin-only)
CREATE TABLE public.legal_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title jsonb NOT NULL,
  description jsonb NOT NULL,
  service_type text NOT NULL,
  metadata jsonb,
  compliance_tags text[],
  is_published boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Web development services (admin-only)
CREATE TABLE public.web_dev_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  description jsonb,
  features jsonb,
  pricing jsonb,
  delivery_time text,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Trademark applications
CREATE TABLE public.trademark_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  applicant_info jsonb NOT NULL,
  logo_url text,
  trademark_class text[],
  description text,
  usage_scenario text,
  status text DEFAULT 'pending',
  payment_status text DEFAULT 'unpaid',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- User profiles (dual-mode)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_type text CHECK (profile_type IN ('personal', 'business')) NOT NULL DEFAULT 'personal',
  name text NOT NULL,
  bio jsonb, -- multilingual
  avatar_url text,
  header_url text,
  location text,
  age integer,
  gender text,
  business_type text,
  region text,
  verification_status text DEFAULT 'unverified',
  verification_documents jsonb,
  language_preference text DEFAULT 'es',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- User posts with scenario tagging
CREATE TABLE public.user_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  images jsonb,
  video_url text,
  scenario_tags text[],
  geo_location point,
  language text DEFAULT 'es',
  is_ad boolean DEFAULT false,
  ad_status text DEFAULT 'pending', -- pending, approved, rejected
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Legal document templates
CREATE TABLE public.legal_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name text NOT NULL,
  template_type text NOT NULL, -- NDA, service_agreement, rental_contract
  content jsonb NOT NULL, -- multilingual template
  variables jsonb, -- template variables
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Generated documents
CREATE TABLE public.generated_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  template_id uuid REFERENCES legal_templates(id),
  document_data jsonb,
  pdf_url text,
  language text,
  lawyer_review_requested boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Encrypted messages
CREATE TABLE public.encrypted_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id),
  recipient_id uuid REFERENCES auth.users(id),
  encrypted_content text NOT NULL,
  message_type text DEFAULT 'text', -- text, image, voice
  is_read boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_dev_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trademark_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encrypted_messages ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- RLS Policies

-- User roles (users can view their own roles, admins can manage all)
CREATE POLICY "Users can view own roles" ON user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" ON user_roles
  FOR ALL USING (public.is_admin(auth.uid()));

-- Travel packages (public read, admin write)
CREATE POLICY "Anyone can view published packages" ON travel_packages
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage packages" ON travel_packages
  FOR ALL USING (public.is_admin(auth.uid()));

-- Legal services (public read, admin write)
CREATE POLICY "Anyone can view published legal services" ON legal_services
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage legal services" ON legal_services
  FOR ALL USING (public.is_admin(auth.uid()));

-- Web dev services (public read, admin write)
CREATE POLICY "Anyone can view active services" ON web_dev_services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage web dev services" ON web_dev_services
  FOR ALL USING (public.is_admin(auth.uid()));

-- Trademark applications (users own, admins all)
CREATE POLICY "Users can manage own applications" ON trademark_applications
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all applications" ON trademark_applications
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Profiles (users own, public read for basic info)
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (id = auth.uid());

CREATE POLICY "Public can view basic profile info" ON profiles
  FOR SELECT USING (true);

-- User posts (users own posts, public read approved ads)
CREATE POLICY "Users can manage own posts" ON user_posts
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Public can view approved content" ON user_posts
  FOR SELECT USING (
    (is_ad = false) OR 
    (is_ad = true AND ad_status = 'approved')
  );

CREATE POLICY "Admins can moderate all posts" ON user_posts
  FOR ALL USING (public.is_admin(auth.uid()));

-- Legal templates (admin only)
CREATE POLICY "Anyone can view active templates" ON legal_templates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage templates" ON legal_templates
  FOR ALL USING (public.is_admin(auth.uid()));

-- Generated documents (users own)
CREATE POLICY "Users can manage own documents" ON generated_documents
  FOR ALL USING (user_id = auth.uid());

-- Encrypted messages (participants only)
CREATE POLICY "Users can access own messages" ON encrypted_messages
  FOR ALL USING (
    sender_id = auth.uid() OR recipient_id = auth.uid()
  );

-- Insert admin role for mexivanza@mexivanza.com
-- This will be handled by a trigger when the user signs up

-- Trigger to auto-assign admin role to mexivanza@mexivanza.com
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, name, profile_type)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'User'),
    'personal'
  );
  
  -- Assign admin role to mexivanza@mexivanza.com
  IF NEW.email = 'mexivanza@mexivanza.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();