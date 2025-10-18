create extension if not exists "pgcrypto";

create table if not exists public.moderation_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.user_profiles(id) on delete set null,
  target_type text not null check (target_type in ('post','comment','user','project','other')),
  target_id uuid,
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open','resolved','ignored')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists moderation_reports_status_idx on public.moderation_reports (status);
create index if not exists moderation_reports_target_idx on public.moderation_reports (target_type, target_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger moderation_reports_set_updated_at
  before update on public.moderation_reports
  for each row execute function public.set_updated_at();
