-- GameForge Sprints and Tasks
-- Manage sprints (development cycles) and tasks within each sprint

-- GameForge Sprints Table
-- Organize work into time-boxed sprints for iterative development
create table if not exists public.gameforge_sprints (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.gameforge_projects(id) on delete cascade,
  sprint_number int not null,
  title text not null,
  description text,
  phase text not null default 'planning' check (phase in ('planning', 'active', 'completed', 'cancelled')),
  status text not null default 'pending' check (status in ('pending', 'active', 'on_hold', 'completed')),
  goal text, -- High-level sprint goal/focus area
  start_date timestamptz,
  end_date timestamptz,
  planned_velocity int, -- Estimated story points or tasks
  actual_velocity int, -- Actual completed story points or tasks
  created_by uuid not null references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, sprint_number)
);

create index if not exists gameforge_sprints_project_id_idx on public.gameforge_sprints (project_id);
create index if not exists gameforge_sprints_phase_idx on public.gameforge_sprints (phase);
create index if not exists gameforge_sprints_status_idx on public.gameforge_sprints (status);
create index if not exists gameforge_sprints_start_date_idx on public.gameforge_sprints (start_date desc);
create index if not exists gameforge_sprints_created_by_idx on public.gameforge_sprints (created_by);

-- GameForge Sprint Members Table
-- Track which team members are participating in a sprint
create table if not exists public.gameforge_sprint_members (
  id uuid primary key default gen_random_uuid(),
  sprint_id uuid not null references public.gameforge_sprints(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role text not null default 'contributor' check (role in ('lead', 'contributor', 'reviewer')),
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (sprint_id, user_id)
);

create index if not exists gameforge_sprint_members_sprint_id_idx on public.gameforge_sprint_members (sprint_id);
create index if not exists gameforge_sprint_members_user_id_idx on public.gameforge_sprint_members (user_id);
create index if not exists gameforge_sprint_members_role_idx on public.gameforge_sprint_members (role);

-- GameForge Tasks Table
-- Individual work items/tasks assigned within sprints
create table if not exists public.gameforge_tasks (
  id uuid primary key default gen_random_uuid(),
  sprint_id uuid references public.gameforge_sprints(id) on delete set null,
  project_id uuid not null references public.gameforge_projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'in_review', 'done', 'blocked')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  estimated_hours numeric(6, 1), -- Story points or hours estimate
  actual_hours numeric(6, 1), -- Actual time spent
  assigned_to uuid references public.user_profiles(id) on delete set null,
  created_by uuid not null references public.user_profiles(id) on delete set null,
  due_date timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gameforge_tasks_sprint_id_idx on public.gameforge_tasks (sprint_id);
create index if not exists gameforge_tasks_project_id_idx on public.gameforge_tasks (project_id);
create index if not exists gameforge_tasks_assigned_to_idx on public.gameforge_tasks (assigned_to);
create index if not exists gameforge_tasks_created_by_idx on public.gameforge_tasks (created_by);
create index if not exists gameforge_tasks_status_idx on public.gameforge_tasks (status);
create index if not exists gameforge_tasks_priority_idx on public.gameforge_tasks (priority);
create index if not exists gameforge_tasks_due_date_idx on public.gameforge_tasks (due_date);

-- Enable RLS
alter table public.gameforge_sprints enable row level security;
alter table public.gameforge_sprint_members enable row level security;
alter table public.gameforge_tasks enable row level security;

-- RLS Policies: gameforge_sprints
create policy "Sprints are readable by authenticated users" on public.gameforge_sprints
  for select using (auth.role() = 'authenticated');

create policy "Project leads can create sprints" on public.gameforge_sprints
  for insert with check (
    exists(
      select 1 from public.gameforge_projects
      where id = project_id and lead_id = auth.uid()
    )
  );

create policy "Project leads can update sprints" on public.gameforge_sprints
  for update using (
    exists(
      select 1 from public.gameforge_projects
      where id = project_id and lead_id = auth.uid()
    )
  );

-- RLS Policies: gameforge_sprint_members
create policy "Sprint members are readable by team" on public.gameforge_sprint_members
  for select using (
    exists(
      select 1 from public.gameforge_sprint_members sm
      where sm.sprint_id = sprint_id and sm.user_id = auth.uid()
    )
    or exists(
      select 1 from public.gameforge_sprints gs
      join public.gameforge_projects gp on gs.project_id = gp.id
      where gs.id = sprint_id and gp.lead_id = auth.uid()
    )
  );

create policy "Users can join sprints" on public.gameforge_sprint_members
  for insert with check (
    auth.uid() = user_id
    or exists(
      select 1 from public.gameforge_sprints gs
      join public.gameforge_projects gp on gs.project_id = gp.id
      where gs.id = sprint_id and gp.lead_id = auth.uid()
    )
  );

create policy "Users can leave sprints" on public.gameforge_sprint_members
  for delete using (auth.uid() = user_id);

-- RLS Policies: gameforge_tasks
create policy "Tasks are readable by sprint members" on public.gameforge_tasks
  for select using (
    exists(
      select 1 from public.gameforge_sprint_members
      where sprint_id = sprint_id and user_id = auth.uid()
    )
    or sprint_id is null
    or exists(
      select 1 from public.gameforge_projects
      where id = project_id and lead_id = auth.uid()
    )
  );

create policy "Project leads and assignees can create tasks" on public.gameforge_tasks
  for insert with check (
    auth.uid() = created_by
    and (
      assigned_to is null
      or assigned_to = auth.uid()
      or exists(
        select 1 from public.gameforge_projects
        where id = project_id and lead_id = auth.uid()
      )
    )
  );

create policy "Assigned users and leads can update tasks" on public.gameforge_tasks
  for update using (
    auth.uid() = assigned_to
    or exists(
      select 1 from public.gameforge_projects
      where id = project_id and lead_id = auth.uid()
    )
  );

-- Triggers for updated_at
create or replace function public.set_gameforge_sprint_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger gameforge_sprints_set_updated_at
  before update on public.gameforge_sprints
  for each row execute function public.set_gameforge_sprint_updated_at();

create trigger gameforge_tasks_set_updated_at
  before update on public.gameforge_tasks
  for each row execute function public.set_gameforge_sprint_updated_at();

-- Comments
comment on table public.gameforge_sprints is 'GameForge sprints: time-boxed development cycles for iterative game development';
comment on table public.gameforge_sprint_members is 'Track team members participating in each sprint';
comment on table public.gameforge_tasks is 'Individual tasks/work items within GameForge projects and sprints';
comment on column public.gameforge_sprints.phase is 'Sprint lifecycle: planning → active → completed (or cancelled)';
comment on column public.gameforge_sprints.goal is 'High-level focus area or objective for the sprint';
comment on column public.gameforge_tasks.status is 'Task workflow: todo → in_progress → in_review → done (or blocked)';
