-- Add likes_count and comments_count columns to community_posts if they don't exist
ALTER TABLE public.community_posts
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0 NOT NULL;

-- Create function to update likes_count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts
    SET likes_count = (SELECT COUNT(*) FROM public.community_post_likes WHERE post_id = NEW.post_id)
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts
    SET likes_count = (SELECT COUNT(*) FROM public.community_post_likes WHERE post_id = OLD.post_id)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to update comments_count
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts
    SET comments_count = (SELECT COUNT(*) FROM public.community_comments WHERE post_id = NEW.post_id)
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts
    SET comments_count = (SELECT COUNT(*) FROM public.community_comments WHERE post_id = OLD.post_id)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trigger_update_post_likes_count ON public.community_post_likes;
DROP TRIGGER IF EXISTS trigger_update_post_comments_count ON public.community_comments;

-- Create triggers for likes
CREATE TRIGGER trigger_update_post_likes_count
AFTER INSERT OR DELETE ON public.community_post_likes
FOR EACH ROW
EXECUTE FUNCTION update_post_likes_count();

-- Create triggers for comments
CREATE TRIGGER trigger_update_post_comments_count
AFTER INSERT OR DELETE ON public.community_comments
FOR EACH ROW
EXECUTE FUNCTION update_post_comments_count();
