-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  author TEXT,
  date TEXT,
  read_time TEXT,
  category TEXT,
  image TEXT,
  body_html TEXT,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);

-- Create index on published_at for sorting
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Blog posts are readable by everyone" ON public.blog_posts
  FOR SELECT
  USING (true);

-- Allow authenticated admins to write/update/delete
CREATE POLICY "Only admins can write blog posts" ON public.blog_posts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only admins can update blog posts" ON public.blog_posts
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can delete blog posts" ON public.blog_posts
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Add grant for service role (backend API access)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO service_role;
