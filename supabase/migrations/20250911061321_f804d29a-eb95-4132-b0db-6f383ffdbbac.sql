-- Update user_posts table to add category support and improve structure
ALTER TABLE public.user_posts 
ADD COLUMN IF NOT EXISTS category text DEFAULT 'News';

-- Add check constraint for valid categories
ALTER TABLE public.user_posts 
ADD CONSTRAINT valid_category 
CHECK (category IN ('News', 'Fitness', 'Cooking', 'Travel', 'Legal', 'Real Estate', 'Business', 'Web Development', 'Events', 'Ads'));

-- Create post_interactions table for likes, comments, and reactions
CREATE TABLE IF NOT EXISTS public.post_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid REFERENCES public.user_posts(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (interaction_type IN ('like', 'comment', 'share')),
  content text, -- For comments
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id, interaction_type) -- Prevent duplicate likes
);

-- Enable RLS on post_interactions
ALTER TABLE public.post_interactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for post_interactions
CREATE POLICY "Users can view all interactions" 
ON public.post_interactions 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create own interactions" 
ON public.post_interactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own interactions" 
ON public.post_interactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_post_interactions_post_id ON public.post_interactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_interactions_user_id ON public.post_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_posts_category ON public.user_posts(category);

-- Update existing posts to have a default category if null
UPDATE public.user_posts SET category = 'News' WHERE category IS NULL;