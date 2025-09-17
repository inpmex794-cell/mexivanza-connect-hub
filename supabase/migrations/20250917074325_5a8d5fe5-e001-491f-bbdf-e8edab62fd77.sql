-- Enable RLS on tables missing it (excluding views)
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_tags ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access to content tables
CREATE POLICY "Public can view published destinations" ON public.destinations FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage destinations" ON public.destinations FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Public can view tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage tags" ON public.tags FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Public can view features" ON public.features FOR SELECT USING (true);
CREATE POLICY "Admins can manage features" ON public.features FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Public can view published pages" ON public.pages FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage pages" ON public.pages FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Public can view media" ON public.media FOR SELECT USING (true);
CREATE POLICY "Admins can manage media" ON public.media FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Public can view published trips" ON public.trips FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage trips" ON public.trips FOR ALL USING (is_admin(auth.uid()));

-- Junction table policies
CREATE POLICY "Public can view service trips" ON public.service_trips FOR SELECT USING (true);
CREATE POLICY "Admins can manage service trips" ON public.service_trips FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Public can view trip features" ON public.trip_features FOR SELECT USING (true);
CREATE POLICY "Admins can manage trip features" ON public.trip_features FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Public can view trip tags" ON public.trip_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage trip tags" ON public.trip_tags FOR ALL USING (is_admin(auth.uid()));