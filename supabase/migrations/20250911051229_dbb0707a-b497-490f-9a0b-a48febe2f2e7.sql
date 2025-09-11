-- Fix the businesses table to add unique constraint
ALTER TABLE public.businesses ADD CONSTRAINT businesses_pkey PRIMARY KEY (id);

-- Now enhance existing business table
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.00;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS verification_documents JSONB;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS payment_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS template_enabled BOOLEAN DEFAULT false;