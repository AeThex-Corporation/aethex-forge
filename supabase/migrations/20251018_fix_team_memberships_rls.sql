-- Fix RLS recursion on team_memberships and define safe, non-recursive policies
begin;

-- Ensure RLS is enabled
alter table public.team_memberships enable row level security;

-- Drop problematic/overly broad policies if they exist
drop policy if exists team_memberships_read on public.team_memberships;
drop policy if exists team_memberships_manage_self on public.team_memberships;

-- Allow users to read only their own membership rows
create policy team_memberships_select_own on public.team_memberships
for select
to authenticated
using (user_id = auth.uid());

-- Allow users to create membership rows only for themselves
create policy team_memberships_insert_self on public.team_memberships
for insert
to authenticated
with check (user_id = auth.uid());

-- Allow users to update only their own membership rows
create policy team_memberships_update_self on public.team_memberships
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Allow users to delete only their own membership rows
create policy team_memberships_delete_self on public.team_memberships
for delete
to authenticated
using (user_id = auth.uid());

-- Drop legacy teams_read policy that referenced public.team_members (recursive)
drop policy if exists teams_read on public.teams;

commit;
