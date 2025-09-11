-- Create RLS policies for business reviews
CREATE POLICY "Anyone can view reviews" ON public.business_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.business_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.business_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.business_reviews FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for ads
CREATE POLICY "Anyone can view active ads" ON public.ads FOR SELECT USING (status = 'active' AND expires_at > now());
CREATE POLICY "Users can create ads" ON public.ads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ads" ON public.ads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ads" ON public.ads FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for real estate
CREATE POLICY "Anyone can view active listings" ON public.real_estate FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create listings" ON public.real_estate FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own listings" ON public.real_estate FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own listings" ON public.real_estate FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for gaming content
CREATE POLICY "Anyone can view gaming content" ON public.gaming_content FOR SELECT USING (true);
CREATE POLICY "Users can create gaming content" ON public.gaming_content FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own gaming content" ON public.gaming_content FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own gaming content" ON public.gaming_content FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for financial data (read-only for users)
CREATE POLICY "Anyone can view financial data" ON public.financial_data FOR SELECT USING (true);

-- Create RLS policies for video content
CREATE POLICY "Anyone can view video content" ON public.video_content FOR SELECT USING (true);
CREATE POLICY "Users can create video content" ON public.video_content FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own video content" ON public.video_content FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own video content" ON public.video_content FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_reviews_business_id ON public.business_reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_business_reviews_rating ON public.business_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_ads_category ON public.ads(category);
CREATE INDEX IF NOT EXISTS idx_ads_location ON public.ads(location);
CREATE INDEX IF NOT EXISTS idx_ads_expires_at ON public.ads(expires_at);
CREATE INDEX IF NOT EXISTS idx_real_estate_location ON public.real_estate(location);
CREATE INDEX IF NOT EXISTS idx_real_estate_price ON public.real_estate(price);
CREATE INDEX IF NOT EXISTS idx_real_estate_property_type ON public.real_estate(property_type);
CREATE INDEX IF NOT EXISTS idx_gaming_content_platform ON public.gaming_content(platform);
CREATE INDEX IF NOT EXISTS idx_financial_data_symbol ON public.financial_data(symbol);
CREATE INDEX IF NOT EXISTS idx_video_content_category ON public.video_content(category);