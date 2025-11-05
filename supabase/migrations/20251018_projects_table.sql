-- Create projects table and RLS policies if missing
begin;

create type if not exists project_status_enum as enum ('planning','in_progress','completed','on_hold');

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  title text not null,
  description text,
  status project_status_enum default 'planning',
  technologies text[],
  github_url text,
  live_url text,
  image_url text,
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

-- Simple policies
do $$ begin
  create policy projects_select_all on public.projects for select to authenticated using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy projects_manage_own on public.projects for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end; $$ language plpgsql;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at before update on public.projects for each row execute procedure public.set_updated_at();

commit;
