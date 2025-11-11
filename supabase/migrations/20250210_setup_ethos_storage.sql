-- Create storage bucket for Ethos tracks if it doesn't exist
-- Note: This SQL migration cannot create buckets directly via SQL
-- The bucket must be created via the Supabase Dashboard or API:
-- 
-- 1. Go to Supabase Dashboard > Storage
-- 2. Click "New bucket"
-- 3. Name: "ethos-tracks"
-- 4. Make it PUBLIC
-- 5. Set up these RLS policies (see below)

-- After bucket is created, apply these RLS policies in SQL:

-- Enable RLS on storage objects
create policy "Allow authenticated users to upload tracks"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'ethos-tracks'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Allow public read access to ethos tracks"
on storage.objects
for select
to public
using (bucket_id = 'ethos-tracks');

create policy "Allow users to delete their own tracks"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'ethos-tracks'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Create index for better performance
create index if not exists idx_storage_bucket_name on storage.objects(bucket_id);
create index if not exists idx_storage_name on storage.objects(name);

-- Comments for documentation
comment on policy "Allow authenticated users to upload tracks" on storage.objects 
  is 'Authenticated users can upload audio files to their own folder in ethos-tracks bucket';

comment on policy "Allow public read access to ethos tracks" on storage.objects 
  is 'Public can read all files in ethos-tracks bucket for streaming';

comment on policy "Allow users to delete their own tracks" on storage.objects 
  is 'Users can delete their own uploaded tracks';
