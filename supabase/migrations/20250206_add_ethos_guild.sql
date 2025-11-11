-- Create extension if needed
create extension if not exists "pgcrypto";

-- Ethos Tracks Table
-- Stores music, SFX, and audio assets uploaded by artists to the Ethos Guild
create table if not exists public.ethos_tracks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  title text not null,
  description text,
  file_url text not null, -- Path to MP3/WAV in storage
  duration_seconds int, -- Track length in seconds
  genre text[], -- e.g., ['Synthwave', 'Orchestral', 'SFX']
  license_type text not null default 'ecosystem' check (license_type in ('ecosystem', 'commercial_sample')),
  -- 'ecosystem': Free license for non-commercial AeThex use
  -- 'commercial_sample': Demo track (user must negotiate commercial licensing)
  bpm int, -- Beats per minute (useful for synchronization)
  is_published boolean not null default true,
  download_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ethos_tracks_user_id_idx on public.ethos_tracks (user_id);
create index if not exists ethos_tracks_license_type_idx on public.ethos_tracks (license_type);
create index if not exists ethos_tracks_genre_gin on public.ethos_tracks using gin (genre);
create index if not exists ethos_tracks_created_at_idx on public.ethos_tracks (created_at desc);

-- Ethos Artist Profiles Table
-- Extends user_profiles with Ethos-specific skills, pricing, and portfolio info
create table if not exists public.ethos_artist_profiles (
  user_id uuid primary key references public.user_profiles(id) on delete cascade,
  skills text[] not null default '{}', -- e.g., ['Synthwave', 'SFX Design', 'Orchestral', 'Game Audio']
  for_hire boolean not null default true, -- Whether artist accepts commissions
  bio text, -- Artist bio/statement
  portfolio_url text, -- External portfolio link
  sample_price_track numeric(10, 2), -- e.g., 500.00 for "Custom Track - $500"
  sample_price_sfx numeric(10, 2), -- e.g., 150.00 for "SFX Pack - $150"
  sample_price_score numeric(10, 2), -- e.g., 2000.00 for "Full Score - $2000"
  turnaround_days int, -- Estimated delivery time in days
  verified boolean not null default false, -- Verified Ethos artist
  total_downloads int not null default 0, -- Total downloads across all tracks
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ethos_artist_profiles_for_hire_idx on public.ethos_artist_profiles (for_hire);
create index if not exists ethos_artist_profiles_verified_idx on public.ethos_artist_profiles (verified);
create index if not exists ethos_artist_profiles_skills_gin on public.ethos_artist_profiles using gin (skills);

-- Ethos Guild Membership Table (optional - tracks who's "part of" the guild)
create table if not exists public.ethos_guild_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'curator', 'admin')),
  -- member: regular artist
  -- curator: can feature/recommend tracks
  -- admin: manages the guild (hiring, moderation, etc.)
  joined_at timestamptz not null default now(),
  bio text -- Member's artist bio
);

create index if not exists ethos_guild_members_user_id_idx on public.ethos_guild_members (user_id);
create index if not exists ethos_guild_members_role_idx on public.ethos_guild_members (role);
create unique index if not exists ethos_guild_members_user_id_unique on public.ethos_guild_members (user_id);

-- Licensing Agreements Table (for tracking commercial contracts)
create table if not exists public.ethos_licensing_agreements (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.ethos_tracks(id) on delete cascade,
  licensee_id uuid not null references public.user_profiles(id) on delete cascade,
  -- licensee_id: The person/org licensing the track (e.g., CORP consulting client)
  license_type text not null check (license_type in ('commercial_one_time', 'commercial_exclusive', 'broadcast')),
  agreement_url text, -- Link to signed contract or legal document
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create index if not exists ethos_licensing_agreements_track_id_idx on public.ethos_licensing_agreements (track_id);
create index if not exists ethos_licensing_agreements_licensee_id_idx on public.ethos_licensing_agreements (licensee_id);

-- Enable RLS
alter table public.ethos_tracks enable row level security;
alter table public.ethos_artist_profiles enable row level security;
alter table public.ethos_guild_members enable row level security;
alter table public.ethos_licensing_agreements enable row level security;

-- RLS Policies: ethos_tracks
create policy "Ethos tracks are readable by all authenticated users" on public.ethos_tracks
  for select using (auth.role() = 'authenticated');

create policy "Users can insert their own tracks" on public.ethos_tracks
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own tracks" on public.ethos_tracks
  for update using (auth.uid() = user_id);

create policy "Users can delete their own tracks" on public.ethos_tracks
  for delete using (auth.uid() = user_id);

-- RLS Policies: ethos_artist_profiles
create policy "Ethos artist profiles are readable by all authenticated users" on public.ethos_artist_profiles
  for select using (auth.role() = 'authenticated');

create policy "Users can insert their own artist profile" on public.ethos_artist_profiles
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own artist profile" on public.ethos_artist_profiles
  for update using (auth.uid() = user_id);

-- RLS Policies: ethos_guild_members
create policy "Guild membership is readable by all authenticated users" on public.ethos_guild_members
  for select using (auth.role() = 'authenticated');

create policy "Admins can manage guild members" on public.ethos_guild_members
  for all using (
    exists(
      select 1 from public.ethos_guild_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

create policy "Users can see their own membership" on public.ethos_guild_members
  for select using (auth.uid() = user_id or auth.role() = 'authenticated');

-- RLS Policies: ethos_licensing_agreements
create policy "Licensing agreements readable by involved parties" on public.ethos_licensing_agreements
  for select using (
    auth.uid() in (
      select user_id from public.ethos_tracks where id = track_id
      union
      select licensee_id
    )
    or exists(
      select 1 from public.ethos_guild_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

create policy "Track owners can approve agreements" on public.ethos_licensing_agreements
  for update using (
    auth.uid() in (
      select user_id from public.ethos_tracks where id = track_id
    )
  );

-- Triggers to maintain updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger ethos_tracks_set_updated_at
  before update on public.ethos_tracks
  for each row execute function public.set_updated_at();

create trigger ethos_artist_profiles_set_updated_at
  before update on public.ethos_artist_profiles
  for each row execute function public.set_updated_at();

create trigger ethos_guild_members_set_updated_at
  before update on public.ethos_guild_members
  for each row execute function public.set_updated_at();

-- Comments for documentation
comment on table public.ethos_tracks is 'Music, SFX, and audio tracks uploaded by Ethos Guild artists';
comment on table public.ethos_artist_profiles is 'Extended profiles for Ethos Guild artists with skills, pricing, and portfolio info';
comment on table public.ethos_guild_members is 'Membership tracking for the Ethos Guild community';
comment on table public.ethos_licensing_agreements is 'Commercial licensing agreements for track usage';
