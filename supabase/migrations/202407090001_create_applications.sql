-- Create applications table for contributor and career submissions
create extension if not exists "pgcrypto";

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('contributor','career')),
  full_name text not null,
  email text not null,
  location text,
  role_interest text,
  primary_skill text,
  experience_level text,
  availability text,
  portfolio_url text,
  resume_url text,
  interests text[],
  message text,
  status text not null default 'new',
  submitted_at timestamptz not null default now()
);

create index if not exists applications_email_idx on public.applications (email);
create index if not exists applications_status_idx on public.applications (status);
