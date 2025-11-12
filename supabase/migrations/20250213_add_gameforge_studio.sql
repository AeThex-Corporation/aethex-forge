-- GameForge Studio Management System
-- Complete project lifecycle tracking for the GameForge game development studio

-- GameForge Projects Table
-- Tracks all game projects in development across the studio
create table if not exists public.gameforge_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  status text not null default 'planning' check (status in ('planning', 'in_development', 'qa', 'released', 'hiatus', 'cancelled')),
  lead_id uuid not null references public.user_profiles(id) on delete set null,
  platform text not null check (platform in ('Unity', 'Unreal', 'Godot', 'Custom', 'WebGL')),
  genre text[] not null default '{}', -- e.g., ['Action', 'RPG', 'Puzzle']
  target_release_date timestamptz,
  actual_release_date timestamptz,
  budget numeric(12, 2), -- Project budget in USD
  current_spend numeric(12, 2) not null default 0, -- Actual spending to date
  team_size int default 0,
  repository_url text, -- GitHub/GitLab repo link
  documentation_url text, -- Design docs, wiki, etc.
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gameforge_projects_status_idx on public.gameforge_projects (status);
create index if not exists gameforge_projects_lead_id_idx on public.gameforge_projects (lead_id);
create index if not exists gameforge_projects_created_at_idx on public.gameforge_projects (created_at desc);
create index if not exists gameforge_projects_platform_idx on public.gameforge_projects (platform);

-- GameForge Team Members Table
-- Studio employees and contractors assigned to projects
create table if not exists public.gameforge_team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role text not null check (role in ('engineer', 'designer', 'artist', 'producer', 'qa', 'sound_designer', 'writer', 'manager')),
  position text, -- e.g., "Lead Programmer", "Character Artist"
  contract_type text not null default 'employee' check (contract_type in ('employee', 'contractor', 'consultant', 'intern')),
  hourly_rate numeric(8, 2), -- Contract rate (if applicable)
  project_ids uuid[] not null default '{}', -- Projects they work on
  skills text[] default '{}', -- e.g., ['C#', 'Unreal', 'Blueprints']
  bio text,
  joined_date timestamptz not null default now(),
  left_date timestamptz, -- When they left the studio (null if still active)
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gameforge_team_members_user_id_idx on public.gameforge_team_members (user_id);
create index if not exists gameforge_team_members_role_idx on public.gameforge_team_members (role);
create index if not exists gameforge_team_members_is_active_idx on public.gameforge_team_members (is_active);
create unique index if not exists gameforge_team_members_user_id_unique on public.gameforge_team_members (user_id);

-- GameForge Builds Table
-- Track game builds, releases, and versions
create table if not exists public.gameforge_builds (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.gameforge_projects(id) on delete cascade,
  version text not null, -- e.g., "1.0.0", "0.5.0-alpha"
  build_type text not null check (build_type in ('alpha', 'beta', 'release_candidate', 'final')),
  release_date timestamptz not null default now(),
  download_url text,
  changelog text, -- Release notes and what changed
  file_size bigint, -- Size in bytes
  target_platforms text[] not null default '{}', -- Windows, Mac, Linux, WebGL, iOS, Android
  download_count int not null default 0,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gameforge_builds_project_id_idx on public.gameforge_builds (project_id);
create index if not exists gameforge_builds_release_date_idx on public.gameforge_builds (release_date desc);
create index if not exists gameforge_builds_version_idx on public.gameforge_builds (version);
create unique index if not exists gameforge_builds_project_version_unique on public.gameforge_builds (project_id, version);

-- GameForge Metrics Table
-- Track monthly/sprint metrics: velocity, shipping speed, team productivity
create table if not exists public.gameforge_metrics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.gameforge_projects(id) on delete cascade,
  metric_date timestamptz not null default now(), -- When this metric period ended
  metric_type text not null check (metric_type in ('monthly', 'sprint', 'milestone')),
  -- Productivity metrics
  velocity int, -- Story points or tasks completed in period
  hours_logged int, -- Total team hours
  team_size_avg int, -- Average team size during period
  -- Quality metrics
  bugs_found int default 0,
  bugs_fixed int default 0,
  build_count int default 0,
  -- Shipping metrics
  days_from_planned_to_release int, -- How many days late/early (shipping velocity)
  on_schedule boolean, -- Whether release hit target date
  -- Financial metrics
  budget_allocated numeric(12, 2),
  budget_spent numeric(12, 2),
  created_at timestamptz not null default now()
);

create index if not exists gameforge_metrics_project_id_idx on public.gameforge_metrics (project_id);
create index if not exists gameforge_metrics_metric_date_idx on public.gameforge_metrics (metric_date desc);
create index if not exists gameforge_metrics_metric_type_idx on public.gameforge_metrics (metric_type);

-- Enable RLS
alter table public.gameforge_projects enable row level security;
alter table public.gameforge_team_members enable row level security;
alter table public.gameforge_builds enable row level security;
alter table public.gameforge_metrics enable row level security;

-- RLS Policies: gameforge_projects
create policy "Projects are readable by all authenticated users" on public.gameforge_projects
  for select using (auth.role() = 'authenticated');

create policy "Studio leads can create projects" on public.gameforge_projects
  for insert with check (auth.uid() = lead_id);

create policy "Project leads can update their projects" on public.gameforge_projects
  for update using (auth.uid() = lead_id);

-- RLS Policies: gameforge_team_members
create policy "Team members are readable by all authenticated users" on public.gameforge_team_members
  for select using (auth.role() = 'authenticated');

create policy "Team members can view their own record" on public.gameforge_team_members
  for select using (auth.uid() = user_id);

create policy "Users can insert their own team member record" on public.gameforge_team_members
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own team member record" on public.gameforge_team_members
  for update using (auth.uid() = user_id);

-- RLS Policies: gameforge_builds
create policy "Builds are readable by all authenticated users" on public.gameforge_builds
  for select using (auth.role() = 'authenticated');

create policy "Project leads can create builds" on public.gameforge_builds
  for insert with check (
    exists(
      select 1 from public.gameforge_projects
      where id = project_id and lead_id = auth.uid()
    )
  );

create policy "Project leads can update builds" on public.gameforge_builds
  for update using (
    exists(
      select 1 from public.gameforge_projects
      where id = project_id and lead_id = auth.uid()
    )
  );

-- RLS Policies: gameforge_metrics
create policy "Metrics are readable by all authenticated users" on public.gameforge_metrics
  for select using (auth.role() = 'authenticated');

create policy "Project leads can insert metrics" on public.gameforge_metrics
  for insert with check (
    exists(
      select 1 from public.gameforge_projects
      where id = project_id and lead_id = auth.uid()
    )
  );

-- Triggers to maintain updated_at
create or replace function public.set_gameforge_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger gameforge_projects_set_updated_at
  before update on public.gameforge_projects
  for each row execute function public.set_gameforge_updated_at();

create trigger gameforge_team_members_set_updated_at
  before update on public.gameforge_team_members
  for each row execute function public.set_gameforge_updated_at();

create trigger gameforge_builds_set_updated_at
  before update on public.gameforge_builds
  for each row execute function public.set_gameforge_updated_at();

-- Comments for documentation
comment on table public.gameforge_projects is 'GameForge studio game projects with lifecycle tracking and team management';
comment on table public.gameforge_team_members is 'GameForge studio team members including engineers, designers, artists, producers, QA';
comment on table public.gameforge_builds is 'Game builds, releases, and versions for each GameForge project';
comment on table public.gameforge_metrics is 'Monthly/sprint metrics for shipping velocity, productivity, quality, and budget tracking';
comment on column public.gameforge_projects.status is 'Project lifecycle: planning → in_development → qa → released (or cancelled/hiatus)';
comment on column public.gameforge_metrics.days_from_planned_to_release is 'Positive = late, Negative = early, Zero = on-time (key shipping velocity metric)';
