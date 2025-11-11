-- Ethos Artist Verification Requests Table
-- Tracks pending artist verification submissions
create table if not exists public.ethos_verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  artist_profile_id uuid not null references public.ethos_artist_profiles(user_id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  -- pending: awaiting review
  -- approved: artist verified
  -- rejected: application rejected
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.user_profiles(id), -- Admin who reviewed
  rejection_reason text, -- Why was this rejected
  submission_notes text, -- Artist's application notes
  portfolio_links text[], -- Links to artist's portfolio/samples
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ethos_verification_requests_user_id_idx on public.ethos_verification_requests (user_id);
create index if not exists ethos_verification_requests_status_idx on public.ethos_verification_requests (status);
create index if not exists ethos_verification_requests_submitted_at_idx on public.ethos_verification_requests (submitted_at desc);
create unique index if not exists ethos_verification_requests_user_id_unique on public.ethos_verification_requests (user_id);

-- Ethos Artist Verification Audit Log
-- Tracks all verification decisions for compliance
create table if not exists public.ethos_verification_audit_log (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.ethos_verification_requests(id) on delete cascade,
  action text not null check (action in ('submitted', 'approved', 'rejected', 'resubmitted')),
  actor_id uuid references public.user_profiles(id), -- Who performed this action
  notes text, -- Additional context
  created_at timestamptz not null default now()
);

create index if not exists ethos_verification_audit_log_request_id_idx on public.ethos_verification_audit_log (request_id);
create index if not exists ethos_verification_audit_log_actor_id_idx on public.ethos_verification_audit_log (actor_id);
create index if not exists ethos_verification_audit_log_action_idx on public.ethos_verification_audit_log (action);

-- Enable RLS
alter table public.ethos_verification_requests enable row level security;
alter table public.ethos_verification_audit_log enable row level security;

-- RLS Policies: ethos_verification_requests
create policy "Artists can view their own verification request" on public.ethos_verification_requests
  for select using (auth.uid() = user_id);

create policy "Admins can view all verification requests" on public.ethos_verification_requests
  for select using (
    exists(
      select 1 from public.user_profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Artists can submit verification request" on public.ethos_verification_requests
  for insert with check (auth.uid() = user_id);

create policy "Admins can update verification status" on public.ethos_verification_requests
  for update using (
    exists(
      select 1 from public.user_profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- RLS Policies: ethos_verification_audit_log
create policy "Admins can view audit log" on public.ethos_verification_audit_log
  for select using (
    exists(
      select 1 from public.user_profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "System can write audit logs" on public.ethos_verification_audit_log
  for insert with check (true);

-- Triggers to maintain updated_at
create or replace function public.set_verification_request_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger ethos_verification_requests_set_updated_at
  before update on public.ethos_verification_requests
  for each row execute function public.set_verification_request_updated_at();

-- Comments for documentation
comment on table public.ethos_verification_requests is 'Tracks artist verification submissions and decisions for manual admin review';
comment on table public.ethos_verification_audit_log is 'Audit trail for all verification actions and decisions';
