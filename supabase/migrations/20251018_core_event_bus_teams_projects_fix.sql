create extension if not exists pgcrypto;

-- Team memberships (avoids conflict with existing team_members table)
create table if not exists public.team_memberships (
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role text not null default 'member',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  primary key (team_id, user_id)
);

alter table public.team_memberships enable row level security;

do $$ begin
  create policy team_memberships_read on public.team_memberships for select to authenticated using (user_id = auth.uid() or exists(select 1 from public.team_memberships m where m.team_id = team_id and m.user_id = auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy team_memberships_manage_self on public.team_memberships for all to authenticated using (user_id = auth.uid());
exception when duplicate_object then null; end $$;

-- Update teams policy to use team_memberships
do $$ begin
  create policy teams_read_membership on public.teams for select to authenticated using (visibility = 'public' or owner_id = auth.uid() or exists(select 1 from public.team_memberships m where m.team_id = id and m.user_id = auth.uid()));
exception when duplicate_object then null; end $$;
