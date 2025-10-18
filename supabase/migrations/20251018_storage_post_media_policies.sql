-- Storage policies for post_media uploads
begin;

-- Ensure RLS is enabled on storage.objects
alter table if exists storage.objects enable row level security;

-- Allow public read for objects in post_media bucket (because bucket is public)
DO $$ BEGIN
  CREATE POLICY IF NOT EXISTS post_media_public_read ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'post_media');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Allow authenticated users to upload to post_media bucket
DO $$ BEGIN
  CREATE POLICY IF NOT EXISTS post_media_auth_insert ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'post_media');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

commit;
