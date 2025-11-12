-- Ethos Service Requests Table
-- Tracks service commission requests from clients to artists
create table if not exists public.ethos_service_requests (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.user_profiles(id) on delete cascade,
  requester_id uuid not null references public.user_profiles(id) on delete cascade,
  service_type text not null check (service_type in ('track_custom', 'sfx_pack', 'full_score', 'day_rate', 'contact_for_quote')),
  -- track_custom: Custom music track
  -- sfx_pack: Sound effects package
  -- full_score: Full game score/composition
  -- day_rate: Hourly consulting rate
  -- contact_for_quote: Custom quote request
  description text not null,
  budget numeric, -- Optional budget in USD
  deadline timestamptz, -- Optional deadline
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'in_progress', 'completed', 'cancelled')),
  notes text, -- Artist notes on the request
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create indexes for performance
create index if not exists ethos_service_requests_artist_id_idx on public.ethos_service_requests (artist_id);
create index if not exists ethos_service_requests_requester_id_idx on public.ethos_service_requests (requester_id);
create index if not exists ethos_service_requests_status_idx on public.ethos_service_requests (status);
create index if not exists ethos_service_requests_created_at_idx on public.ethos_service_requests (created_at desc);

-- Enable RLS
alter table public.ethos_service_requests enable row level security;

-- RLS Policies: ethos_service_requests
create policy "Artists can view their service requests"
  on public.ethos_service_requests
  for select using (auth.uid() = artist_id);

create policy "Requesters can view their service requests"
  on public.ethos_service_requests
  for select using (auth.uid() = requester_id);

create policy "Authenticated users can create service requests"
  on public.ethos_service_requests
  for insert with check (auth.uid() = requester_id);

create policy "Artists can update their service requests"
  on public.ethos_service_requests
  for update using (auth.uid() = artist_id);

-- Trigger to maintain updated_at
create trigger ethos_service_requests_set_updated_at
  before update on public.ethos_service_requests
  for each row execute function public.set_updated_at();

-- Comments for documentation
comment on table public.ethos_service_requests is 'Service commission requests from clients to Ethos Guild artists';
comment on column public.ethos_service_requests.status is 'Status of the service request: pending (awaiting response), accepted (artist accepted), declined (artist declined), in_progress (work started), completed (work finished), cancelled (client cancelled)';
comment on column public.ethos_service_requests.budget is 'Optional budget amount in USD for the requested service';
comment on column public.ethos_service_requests.deadline is 'Optional deadline for the service completion';
