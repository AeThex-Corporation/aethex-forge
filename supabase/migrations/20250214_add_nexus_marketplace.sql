-- Nexus: Talent Marketplace
-- Commercial bridge between Foundation (community) and Corp (clients)
-- Includes: Creator Profiles, Opportunities, Applications, Messaging, Payments/Commissions

create extension if not exists "pgcrypto";

-- ============================================================================
-- CREATOR PROFILES & PORTFOLIO
-- ============================================================================

create table if not exists public.nexus_creator_profiles (
  user_id uuid primary key references public.user_profiles(id) on delete cascade,
  headline text, -- e.g., "Game Developer | Unreal Engine Specialist"
  bio text,
  profile_image_url text,
  skills text[] not null default '{}', -- e.g., ['Unreal Engine', 'C++', 'Game Design']
  experience_level text not null default 'intermediate' check (experience_level in ('beginner', 'intermediate', 'advanced', 'expert')),
  hourly_rate numeric(10, 2),
  portfolio_url text,
  availability_status text not null default 'available' check (availability_status in ('available', 'busy', 'unavailable')),
  availability_hours_per_week int,
  verified boolean not null default false,
  total_earnings numeric(12, 2) not null default 0,
  rating numeric(3, 2), -- average rating
  review_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_creator_profiles_verified_idx on public.nexus_creator_profiles (verified);
create index if not exists nexus_creator_profiles_availability_idx on public.nexus_creator_profiles (availability_status);
create index if not exists nexus_creator_profiles_skills_gin on public.nexus_creator_profiles using gin (skills);
create index if not exists nexus_creator_profiles_rating_idx on public.nexus_creator_profiles (rating desc);

-- Creator Portfolio Projects
create table if not exists public.nexus_portfolio_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  title text not null,
  description text,
  project_url text,
  image_url text,
  skills_used text[] not null default '{}',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_portfolio_items_user_idx on public.nexus_portfolio_items (user_id);
create index if not exists nexus_portfolio_items_featured_idx on public.nexus_portfolio_items (featured);

-- Creator Endorsements (peer-to-peer skill validation)
create table if not exists public.nexus_skill_endorsements (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.user_profiles(id) on delete cascade,
  endorsed_by uuid not null references public.user_profiles(id) on delete cascade,
  skill text not null,
  created_at timestamptz not null default now(),
  unique(creator_id, endorsed_by, skill)
);

create index if not exists nexus_skill_endorsements_creator_idx on public.nexus_skill_endorsements (creator_id);
create index if not exists nexus_skill_endorsements_endorsed_by_idx on public.nexus_skill_endorsements (endorsed_by);

-- ============================================================================
-- OPPORTUNITIES (JOBS/COLLABS)
-- ============================================================================

create table if not exists public.nexus_opportunities (
  id uuid primary key default gen_random_uuid(),
  posted_by uuid not null references public.user_profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null, -- 'development', 'design', 'audio', 'marketing', etc.
  required_skills text[] not null default '{}',
  budget_type text not null check (budget_type in ('hourly', 'fixed', 'range')),
  budget_min numeric(12, 2),
  budget_max numeric(12, 2),
  timeline_type text not null default 'flexible' check (timeline_type in ('urgent', 'short-term', 'long-term', 'ongoing', 'flexible')),
  duration_weeks int,
  location_requirement text default 'remote' check (location_requirement in ('remote', 'onsite', 'hybrid')),
  required_experience text default 'any' check (required_experience in ('any', 'beginner', 'intermediate', 'advanced', 'expert')),
  company_name text,
  status text not null default 'open' check (status in ('open', 'in_progress', 'filled', 'closed', 'cancelled')),
  application_count int not null default 0,
  selected_creator_id uuid references public.user_profiles(id) on delete set null,
  views int not null default 0,
  is_featured boolean not null default false,
  published_at timestamptz not null default now(),
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_opportunities_posted_by_idx on public.nexus_opportunities (posted_by);
create index if not exists nexus_opportunities_status_idx on public.nexus_opportunities (status);
create index if not exists nexus_opportunities_category_idx on public.nexus_opportunities (category);
create index if not exists nexus_opportunities_skills_gin on public.nexus_opportunities using gin (required_skills);
create index if not exists nexus_opportunities_featured_idx on public.nexus_opportunities (is_featured);
create index if not exists nexus_opportunities_created_idx on public.nexus_opportunities (created_at desc);

-- ============================================================================
-- APPLICATIONS & MATCHING
-- ============================================================================

create table if not exists public.nexus_applications (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.nexus_opportunities(id) on delete cascade,
  creator_id uuid not null references public.user_profiles(id) on delete cascade,
  status text not null default 'submitted' check (status in ('submitted', 'reviewing', 'accepted', 'rejected', 'hired', 'archived')),
  cover_letter text,
  proposed_rate numeric(12, 2),
  proposal text, -- detailed proposal/pitch
  application_questions jsonb, -- answers to custom questions if any
  viewed_at timestamptz,
  responded_at timestamptz,
  response_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(opportunity_id, creator_id)
);

create index if not exists nexus_applications_opportunity_idx on public.nexus_applications (opportunity_id);
create index if not exists nexus_applications_creator_idx on public.nexus_applications (creator_id);
create index if not exists nexus_applications_status_idx on public.nexus_applications (status);
create index if not exists nexus_applications_created_idx on public.nexus_applications (created_at desc);

-- Application Reviews/Ratings
create table if not exists public.nexus_reviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.nexus_applications(id) on delete cascade,
  opportunity_id uuid not null references public.nexus_opportunities(id) on delete cascade,
  reviewer_id uuid not null references public.user_profiles(id) on delete cascade,
  creator_id uuid not null references public.user_profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  review_text text,
  created_at timestamptz not null default now(),
  unique(application_id, reviewer_id)
);

create index if not exists nexus_reviews_creator_idx on public.nexus_reviews (creator_id);
create index if not exists nexus_reviews_reviewer_idx on public.nexus_reviews (reviewer_id);

-- ============================================================================
-- CONTRACTS & ORDERS
-- ============================================================================

create table if not exists public.nexus_contracts (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references public.nexus_opportunities(id) on delete set null,
  creator_id uuid not null references public.user_profiles(id) on delete cascade,
  client_id uuid not null references public.user_profiles(id) on delete cascade,
  title text not null,
  description text,
  contract_type text not null check (contract_type in ('one-time', 'retainer', 'hourly')),
  total_amount numeric(12, 2) not null,
  aethex_commission_percent numeric(5, 2) not null default 20,
  aethex_commission_amount numeric(12, 2) not null default 0,
  creator_payout_amount numeric(12, 2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'active', 'completed', 'disputed', 'cancelled')),
  start_date timestamptz,
  end_date timestamptz,
  milestone_count int default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_contracts_creator_idx on public.nexus_contracts (creator_id);
create index if not exists nexus_contracts_client_idx on public.nexus_contracts (client_id);
create index if not exists nexus_contracts_status_idx on public.nexus_contracts (status);

-- Milestones (for progressive payments)
create table if not exists public.nexus_milestones (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.nexus_contracts(id) on delete cascade,
  milestone_number int not null,
  description text,
  amount numeric(12, 2) not null,
  due_date timestamptz,
  status text not null default 'pending' check (status in ('pending', 'submitted', 'approved', 'paid', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(contract_id, milestone_number)
);

-- Payments & Commission Tracking
create table if not exists public.nexus_payments (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.nexus_contracts(id) on delete cascade,
  milestone_id uuid references public.nexus_milestones(id) on delete set null,
  amount numeric(12, 2) not null,
  creator_payout numeric(12, 2) not null,
  aethex_commission numeric(12, 2) not null,
  payment_method text not null default 'stripe', -- stripe, bank_transfer, paypal
  payment_status text not null default 'pending' check (payment_status in ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_date timestamptz,
  payout_date timestamptz,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_payments_contract_idx on public.nexus_payments (contract_id);
create index if not exists nexus_payments_status_idx on public.nexus_payments (payment_status);

-- Commission Ledger (financial tracking)
create table if not exists public.nexus_commission_ledger (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid references public.nexus_payments(id) on delete set null,
  period_start date,
  period_end date,
  total_volume numeric(12, 2) not null,
  total_commission numeric(12, 2) not null,
  creator_payouts numeric(12, 2) not null,
  aethex_revenue numeric(12, 2) not null,
  status text not null default 'pending' check (status in ('pending', 'settled', 'disputed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- MESSAGING & COLLABORATION
-- ============================================================================

create table if not exists public.nexus_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid,
  sender_id uuid not null references public.user_profiles(id) on delete cascade,
  recipient_id uuid not null references public.user_profiles(id) on delete cascade,
  opportunity_id uuid references public.nexus_opportunities(id) on delete set null,
  contract_id uuid references public.nexus_contracts(id) on delete set null,
  message_text text not null,
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists nexus_messages_sender_idx on public.nexus_messages (sender_id);
create index if not exists nexus_messages_recipient_idx on public.nexus_messages (recipient_id);
create index if not exists nexus_messages_opportunity_idx on public.nexus_messages (opportunity_id);
create index if not exists nexus_messages_created_idx on public.nexus_messages (created_at desc);

-- Conversations (threads)
create table if not exists public.nexus_conversations (
  id uuid primary key default gen_random_uuid(),
  participant_1 uuid not null references public.user_profiles(id) on delete cascade,
  participant_2 uuid not null references public.user_profiles(id) on delete cascade,
  opportunity_id uuid references public.nexus_opportunities(id) on delete set null,
  contract_id uuid references public.nexus_contracts(id) on delete set null,
  subject text,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(participant_1, participant_2, opportunity_id)
);

create index if not exists nexus_conversations_participants_idx on public.nexus_conversations (participant_1, participant_2);

-- ============================================================================
-- DISPUTES & RESOLUTION
-- ============================================================================

create table if not exists public.nexus_disputes (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.nexus_contracts(id) on delete cascade,
  reported_by uuid not null references public.user_profiles(id) on delete cascade,
  reason text not null,
  description text,
  evidence_urls text[] default '{}',
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'escalated')),
  resolution_notes text,
  resolved_by uuid references public.user_profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_disputes_contract_idx on public.nexus_disputes (contract_id);
create index if not exists nexus_disputes_status_idx on public.nexus_disputes (status);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

alter table public.nexus_creator_profiles enable row level security;
alter table public.nexus_portfolio_items enable row level security;
alter table public.nexus_skill_endorsements enable row level security;
alter table public.nexus_opportunities enable row level security;
alter table public.nexus_applications enable row level security;
alter table public.nexus_reviews enable row level security;
alter table public.nexus_contracts enable row level security;
alter table public.nexus_milestones enable row level security;
alter table public.nexus_payments enable row level security;
alter table public.nexus_commission_ledger enable row level security;
alter table public.nexus_messages enable row level security;
alter table public.nexus_conversations enable row level security;
alter table public.nexus_disputes enable row level security;

-- Creator Profiles: verified visible, own editable
create policy "Verified creator profiles visible to all" on public.nexus_creator_profiles
  for select using (verified = true or auth.uid() = user_id or exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

create policy "Users manage own creator profile" on public.nexus_creator_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Portfolio: public for verified creators
create policy "Portfolio items visible when creator verified" on public.nexus_portfolio_items
  for select using (
    exists(select 1 from public.nexus_creator_profiles where user_id = user_id and verified = true) or
    auth.uid() = user_id
  );

create policy "Users manage own portfolio" on public.nexus_portfolio_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Endorsements: all visible
create policy "Endorsements readable by all authenticated" on public.nexus_skill_endorsements
  for select using (auth.role() = 'authenticated');

create policy "Users can endorse skills" on public.nexus_skill_endorsements
  for insert with check (auth.uid() = endorsed_by);

-- Opportunities: open ones visible, own/applied visible to creator
create policy "Open opportunities visible to all" on public.nexus_opportunities
  for select using (status = 'open' or auth.uid() = posted_by or
    exists(select 1 from public.nexus_applications where opportunity_id = id and creator_id = auth.uid()));

create policy "Clients post opportunities" on public.nexus_opportunities
  for insert with check (auth.uid() = posted_by);

create policy "Clients manage own opportunities" on public.nexus_opportunities
  for update using (auth.uid() = posted_by);

-- Applications: involved parties see
create policy "Applications visible to applicant and poster" on public.nexus_applications
  for select using (auth.uid() = creator_id or auth.uid() in (select posted_by from public.nexus_opportunities where id = opportunity_id));

create policy "Creators submit applications" on public.nexus_applications
  for insert with check (auth.uid() = creator_id);

create policy "Applicants/posters update applications" on public.nexus_applications
  for update using (auth.uid() = creator_id or auth.uid() in (select posted_by from public.nexus_opportunities where id = opportunity_id));

-- Reviews: visible to parties, admin
create policy "Reviews visible to involved" on public.nexus_reviews
  for select using (auth.uid() = creator_id or auth.uid() = reviewer_id or exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

-- Contracts: involved parties only
create policy "Contracts visible to parties" on public.nexus_contracts
  for select using (auth.uid() = creator_id or auth.uid() = client_id or exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

-- Messages: involved parties
create policy "Messages visible to parties" on public.nexus_messages
  for select using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "Users send messages" on public.nexus_messages
  for insert with check (auth.uid() = sender_id);

-- Conversations: participants
create policy "Conversations visible to participants" on public.nexus_conversations
  for select using (auth.uid() in (participant_1, participant_2));

-- Disputes: involved parties
create policy "Disputes visible to involved" on public.nexus_disputes
  for select using (auth.uid() in (select creator_id from public.nexus_contracts where id = contract_id union select client_id from public.nexus_contracts where id = contract_id) or exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

-- ============================================================================
-- TRIGGERS
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger nexus_creator_profiles_set_updated_at before update on public.nexus_creator_profiles for each row execute function public.set_updated_at();
create trigger nexus_portfolio_items_set_updated_at before update on public.nexus_portfolio_items for each row execute function public.set_updated_at();
create trigger nexus_opportunities_set_updated_at before update on public.nexus_opportunities for each row execute function public.set_updated_at();
create trigger nexus_applications_set_updated_at before update on public.nexus_applications for each row execute function public.set_updated_at();
create trigger nexus_contracts_set_updated_at before update on public.nexus_contracts for each row execute function public.set_updated_at();
create trigger nexus_milestones_set_updated_at before update on public.nexus_milestones for each row execute function public.set_updated_at();
create trigger nexus_payments_set_updated_at before update on public.nexus_payments for each row execute function public.set_updated_at();
create trigger nexus_commission_ledger_set_updated_at before update on public.nexus_commission_ledger for each row execute function public.set_updated_at();
create trigger nexus_conversations_set_updated_at before update on public.nexus_conversations for each row execute function public.set_updated_at();
create trigger nexus_disputes_set_updated_at before update on public.nexus_disputes for each row execute function public.set_updated_at();

-- ============================================================================
-- COMMENTS
-- ============================================================================

comment on table public.nexus_creator_profiles is 'Creator profiles with skills, rates, portfolio';
comment on table public.nexus_portfolio_items is 'Creator portfolio/project showcase';
comment on table public.nexus_skill_endorsements is 'Peer endorsements for skill validation';
comment on table public.nexus_opportunities is 'Job/collaboration postings by clients';
comment on table public.nexus_applications is 'Creator applications to opportunities';
comment on table public.nexus_reviews is 'Reviews/ratings for completed work';
comment on table public.nexus_contracts is 'Signed contracts with AeThex commission split';
comment on table public.nexus_milestones is 'Contract milestones for progressive payments';
comment on table public.nexus_payments is 'Payment transactions and commission tracking';
comment on table public.nexus_commission_ledger is 'Financial ledger for AeThex revenue tracking';
comment on table public.nexus_messages is 'Marketplace messaging between parties';
comment on table public.nexus_conversations is 'Message conversation threads';
comment on table public.nexus_disputes is 'Dispute resolution for contracts';
