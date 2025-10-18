-- Core event bus + teams/projects primitives
create extension if not exists pgcrypto;

-- Teams
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.user_profiles(id) on delete cascade,
  name text not null,
  slug text unique,
  description text,
  visibility text not null default 'private', -- private | public
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role text not null default 'member', -- owner | admin | member
  status text not null default 'active', -- active | invited | pending
  created_at timestamptz not null default now(),
  primary key (team_id, user_id)
);

-- Project memberships
create table if not exists public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role text not null default 'contributor', -- owner | manager | contributor | viewer
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

-- Project tasks (lightweight Kanban)
create table if not exists public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo', -- todo | doing | done | blocked
  assignee_id uuid references public.user_profiles(id) on delete set null,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Activity/Event bus
create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.user_profiles(id) on delete cascade,
  verb text not null,                 -- e.g., created, joined, commented
  object_type text not null,          -- project, task, team, post, profile
  object_id uuid,
  target_id uuid,                     -- optional user/team/project
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Notification preferences per user
create table if not exists public.notification_preferences (
  user_id uuid primary key references public.user_profiles(id) on delete cascade,
  prefs jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- RLS enablement
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.project_members enable row level security;
alter table public.project_tasks enable row level security;
alter table public.activity_events enable row level security;
alter table public.notification_preferences enable row level security;

-- Basic policies
do $$ begin
  create policy teams_read on public.teams for select to authenticated using (visibility = 'public' or owner_id = auth.uid() or exists(select 1 from public.team_members m where m.team_id = id and m.user_id = auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy teams_manage_own on public.teams for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy team_members_read on public.team_members for select to authenticated using (user_id = auth.uid() or exists(select 1 from public.team_members m where m.team_id = team_id and m.user_id = auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy team_members_manage_self on public.team_members for all to authenticated using (user_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy project_members_read on public.project_members for select to authenticated using (user_id = auth.uid() or exists(select 1 from public.project_members pm where pm.project_id = project_id and pm.user_id = auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy project_members_manage_self on public.project_members for all to authenticated using (user_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy project_tasks_read on public.project_tasks for select to authenticated using (exists(select 1 from public.project_members pm where pm.project_id = project_id and pm.user_id = auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy project_tasks_contrib on public.project_tasks for all to authenticated using (exists(select 1 from public.project_members pm where pm.project_id = project_id and pm.user_id = auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy activity_events_read on public.activity_events for select to authenticated using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy notification_prefs_self on public.notification_preferences for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
exception when duplicate_object then null; end $$;
