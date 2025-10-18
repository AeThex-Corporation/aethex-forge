create extension if not exists "pgcrypto";

-- Mentors registry
create table if not exists public.mentors (
  user_id uuid primary key references public.user_profiles(id) on delete cascade,
  bio text,
  expertise text[] not null default '{}',
  available boolean not null default true,
  hourly_rate numeric(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mentors_available_idx on public.mentors (available);
create index if not exists mentors_expertise_gin on public.mentors using gin (expertise);

-- Mentorship requests
create table if not exists public.mentorship_requests (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.user_profiles(id) on delete cascade,
  mentee_id uuid not null references public.user_profiles(id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending','accepted','rejected','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mentorship_requests_mentor_idx on public.mentorship_requests (mentor_id);
create index if not exists mentorship_requests_mentee_idx on public.mentorship_requests (mentee_id);
create index if not exists mentorship_requests_status_idx on public.mentorship_requests (status);

-- Prevent duplicate pending requests between same pair
create unique index if not exists mentorship_requests_unique_pending on public.mentorship_requests (mentor_id, mentee_id) where status = 'pending';

-- Simple trigger to maintain updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger mentors_set_updated_at
  before update on public.mentors
  for each row execute function public.set_updated_at();

create trigger mentorship_requests_set_updated_at
  before update on public.mentorship_requests
  for each row execute function public.set_updated_at();
