-- NEXUS Core: Universal Data Layer
-- Single Source of Truth for talent/contract metadata
-- Supports AZ Tax Commission reporting, time logs, and compliance tracking

create extension if not exists "pgcrypto";

-- ============================================================================
-- TALENT PROFILES (Legal/Tax Layer)
-- ============================================================================

create table if not exists public.nexus_talent_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.user_profiles(id) on delete cascade,
  legal_first_name text,
  legal_last_name text,
  legal_name_encrypted bytea, -- pgcrypto encrypted full legal name
  tax_id_encrypted bytea, -- SSN/EIN encrypted
  tax_id_last_four text, -- last 4 digits for display
  tax_classification text check (tax_classification in ('w2_employee', '1099_contractor', 'corp_entity', 'foreign')),
  residency_state text, -- US state code (e.g., 'AZ', 'CA')
  residency_country text not null default 'US',
  address_line1_encrypted bytea,
  address_city text,
  address_state text,
  address_zip text,
  compliance_status text not null default 'pending' check (compliance_status in ('pending', 'verified', 'expired', 'rejected', 'review_needed')),
  compliance_verified_at timestamptz,
  compliance_expires_at timestamptz,
  az_eligible boolean not null default false, -- Eligible for AZ Tax Credit
  w9_submitted boolean not null default false,
  w9_submitted_at timestamptz,
  bank_account_connected boolean not null default false,
  stripe_connect_account_id text,
  payout_method text default 'stripe' check (payout_method in ('stripe', 'ach', 'check', 'paypal')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_talent_profiles_user_idx on public.nexus_talent_profiles (user_id);
create index if not exists nexus_talent_profiles_compliance_idx on public.nexus_talent_profiles (compliance_status);
create index if not exists nexus_talent_profiles_az_eligible_idx on public.nexus_talent_profiles (az_eligible);
create index if not exists nexus_talent_profiles_state_idx on public.nexus_talent_profiles (residency_state);

-- ============================================================================
-- TIME LOGS (Hour Tracking with AZ Compliance)
-- ============================================================================

create table if not exists public.nexus_time_logs (
  id uuid primary key default gen_random_uuid(),
  talent_profile_id uuid not null references public.nexus_talent_profiles(id) on delete cascade,
  contract_id uuid references public.nexus_contracts(id) on delete set null,
  milestone_id uuid references public.nexus_milestones(id) on delete set null,
  log_date date not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  hours_worked numeric(5, 2) not null,
  description text,
  task_category text, -- 'development', 'design', 'review', 'meeting', etc.
  location_type text not null default 'remote' check (location_type in ('remote', 'onsite', 'hybrid')),
  location_state text, -- State where work was performed (critical for AZ)
  location_city text,
  location_latitude numeric(10, 7),
  location_longitude numeric(10, 7),
  location_verified boolean not null default false,
  az_eligible_hours numeric(5, 2) default 0, -- Hours qualifying for AZ Tax Credit
  billable boolean not null default true,
  billed boolean not null default false,
  billed_at timestamptz,
  invoice_id uuid references public.corp_invoices(id) on delete set null,
  submission_status text not null default 'draft' check (submission_status in ('draft', 'submitted', 'approved', 'rejected', 'exported')),
  submitted_at timestamptz,
  approved_at timestamptz,
  approved_by uuid references public.user_profiles(id) on delete set null,
  tax_period text, -- e.g., '2025-Q1', '2025-12'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_time_logs_talent_idx on public.nexus_time_logs (talent_profile_id);
create index if not exists nexus_time_logs_contract_idx on public.nexus_time_logs (contract_id);
create index if not exists nexus_time_logs_date_idx on public.nexus_time_logs (log_date desc);
create index if not exists nexus_time_logs_status_idx on public.nexus_time_logs (submission_status);
create index if not exists nexus_time_logs_state_idx on public.nexus_time_logs (location_state);
create index if not exists nexus_time_logs_az_idx on public.nexus_time_logs (az_eligible_hours) where az_eligible_hours > 0;
create index if not exists nexus_time_logs_period_idx on public.nexus_time_logs (tax_period);

-- ============================================================================
-- TIME LOG AUDITS (Review & AZ Submission Tracking)
-- ============================================================================

create table if not exists public.nexus_time_log_audits (
  id uuid primary key default gen_random_uuid(),
  time_log_id uuid not null references public.nexus_time_logs(id) on delete cascade,
  reviewer_id uuid references public.user_profiles(id) on delete set null,
  audit_type text not null check (audit_type in ('review', 'approval', 'rejection', 'az_submission', 'correction', 'dispute')),
  decision text check (decision in ('approved', 'rejected', 'needs_correction', 'submitted', 'acknowledged')),
  notes text,
  corrections_made jsonb, -- { field: { old: value, new: value } }
  az_submission_id text, -- ID from AZ Tax Commission API
  az_submission_status text check (az_submission_status in ('pending', 'accepted', 'rejected', 'error')),
  az_submission_response jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists nexus_time_log_audits_log_idx on public.nexus_time_log_audits (time_log_id);
create index if not exists nexus_time_log_audits_reviewer_idx on public.nexus_time_log_audits (reviewer_id);
create index if not exists nexus_time_log_audits_type_idx on public.nexus_time_log_audits (audit_type);
create index if not exists nexus_time_log_audits_az_idx on public.nexus_time_log_audits (az_submission_id) where az_submission_id is not null;

-- ============================================================================
-- COMPLIANCE EVENTS (Cross-Entity Audit Trail)
-- ============================================================================

create table if not exists public.nexus_compliance_events (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null, -- 'talent', 'client', 'contract', 'time_log', 'payout'
  entity_id uuid not null,
  event_type text not null, -- 'created', 'verified', 'exported', 'access_logged', 'financial_update', etc.
  event_category text not null check (event_category in ('compliance', 'financial', 'access', 'data_change', 'tax_reporting', 'legal')),
  actor_id uuid references public.user_profiles(id) on delete set null,
  actor_role text, -- 'talent', 'client', 'admin', 'system', 'api'
  realm_context text, -- 'nexus', 'corp', 'foundation', 'studio'
  description text,
  payload jsonb, -- Full event data
  sensitive_data_accessed boolean not null default false,
  financial_amount numeric(12, 2),
  legal_entity text, -- 'for_profit', 'non_profit'
  cross_entity_access boolean not null default false, -- True if Foundation accessed Corp data
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists nexus_compliance_events_entity_idx on public.nexus_compliance_events (entity_type, entity_id);
create index if not exists nexus_compliance_events_type_idx on public.nexus_compliance_events (event_type);
create index if not exists nexus_compliance_events_category_idx on public.nexus_compliance_events (event_category);
create index if not exists nexus_compliance_events_actor_idx on public.nexus_compliance_events (actor_id);
create index if not exists nexus_compliance_events_realm_idx on public.nexus_compliance_events (realm_context);
create index if not exists nexus_compliance_events_cross_entity_idx on public.nexus_compliance_events (cross_entity_access) where cross_entity_access = true;
create index if not exists nexus_compliance_events_created_idx on public.nexus_compliance_events (created_at desc);

-- ============================================================================
-- ESCROW LEDGER (Financial Tracking)
-- ============================================================================

create table if not exists public.nexus_escrow_ledger (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.nexus_contracts(id) on delete cascade,
  client_id uuid not null references public.user_profiles(id) on delete cascade,
  creator_id uuid not null references public.user_profiles(id) on delete cascade,
  escrow_balance numeric(12, 2) not null default 0,
  funds_deposited numeric(12, 2) not null default 0,
  funds_released numeric(12, 2) not null default 0,
  funds_refunded numeric(12, 2) not null default 0,
  aethex_fees numeric(12, 2) not null default 0,
  stripe_customer_id text,
  stripe_escrow_intent_id text,
  status text not null default 'unfunded' check (status in ('unfunded', 'funded', 'partially_funded', 'released', 'disputed', 'refunded')),
  funded_at timestamptz,
  released_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_escrow_ledger_contract_idx on public.nexus_escrow_ledger (contract_id);
create index if not exists nexus_escrow_ledger_client_idx on public.nexus_escrow_ledger (client_id);
create index if not exists nexus_escrow_ledger_creator_idx on public.nexus_escrow_ledger (creator_id);
create index if not exists nexus_escrow_ledger_status_idx on public.nexus_escrow_ledger (status);

-- ============================================================================
-- PAYOUT RECORDS (Separate from payments for tax tracking)
-- ============================================================================

create table if not exists public.nexus_payouts (
  id uuid primary key default gen_random_uuid(),
  talent_profile_id uuid not null references public.nexus_talent_profiles(id) on delete cascade,
  contract_id uuid references public.nexus_contracts(id) on delete set null,
  payment_id uuid references public.nexus_payments(id) on delete set null,
  gross_amount numeric(12, 2) not null,
  platform_fee numeric(12, 2) not null default 0,
  processing_fee numeric(12, 2) not null default 0,
  tax_withholding numeric(12, 2) not null default 0,
  net_amount numeric(12, 2) not null,
  payout_method text not null default 'stripe' check (payout_method in ('stripe', 'ach', 'check', 'paypal')),
  stripe_payout_id text,
  ach_trace_number text,
  check_number text,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  scheduled_date date,
  processed_at timestamptz,
  failure_reason text,
  tax_year int not null default extract(year from now()),
  tax_form_type text, -- '1099-NEC', 'W-2', etc.
  tax_form_generated boolean not null default false,
  tax_form_file_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists nexus_payouts_talent_idx on public.nexus_payouts (talent_profile_id);
create index if not exists nexus_payouts_contract_idx on public.nexus_payouts (contract_id);
create index if not exists nexus_payouts_status_idx on public.nexus_payouts (status);
create index if not exists nexus_payouts_tax_year_idx on public.nexus_payouts (tax_year);
create index if not exists nexus_payouts_scheduled_idx on public.nexus_payouts (scheduled_date);

-- ============================================================================
-- FOUNDATION GIG RADAR VIEW (Read-Only Projection)
-- ============================================================================

create or replace view public.foundation_gig_radar as
select 
  o.id as opportunity_id,
  o.title,
  o.category,
  o.required_skills,
  o.timeline_type,
  o.location_requirement,
  o.required_experience,
  o.status,
  o.published_at,
  case 
    when o.status = 'open' then 'available'
    when o.status = 'in_progress' then 'in_progress'
    else 'filled'
  end as availability_status,
  (select count(*) from public.nexus_applications a where a.opportunity_id = o.id) as applicant_count,
  case when o.budget_type = 'hourly' then 'hourly' else 'project' end as compensation_type
from public.nexus_opportunities o
where o.status in ('open', 'in_progress')
order by o.published_at desc;

comment on view public.foundation_gig_radar is 'Read-only view for Foundation Gig Radar - no financial data exposed';

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

alter table public.nexus_talent_profiles enable row level security;
alter table public.nexus_time_logs enable row level security;
alter table public.nexus_time_log_audits enable row level security;
alter table public.nexus_compliance_events enable row level security;
alter table public.nexus_escrow_ledger enable row level security;
alter table public.nexus_payouts enable row level security;

-- Talent Profiles: own profile only (sensitive data)
create policy "Users view own talent profile" on public.nexus_talent_profiles
  for select using (auth.uid() = user_id);

create policy "Users manage own talent profile" on public.nexus_talent_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Admins view all talent profiles" on public.nexus_talent_profiles
  for select using (exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

-- Time Logs: talent and contract parties
create policy "Talent views own time logs" on public.nexus_time_logs
  for select using (
    auth.uid() in (select user_id from public.nexus_talent_profiles where id = talent_profile_id)
  );

create policy "Contract clients view time logs" on public.nexus_time_logs
  for select using (
    contract_id is not null and
    auth.uid() in (select client_id from public.nexus_contracts where id = contract_id)
  );

create policy "Talent manages own time logs" on public.nexus_time_logs
  for all using (
    auth.uid() in (select user_id from public.nexus_talent_profiles where id = talent_profile_id)
  ) with check (
    auth.uid() in (select user_id from public.nexus_talent_profiles where id = talent_profile_id)
  );

-- Time Log Audits: reviewers and talent
create policy "Time log audit visibility" on public.nexus_time_log_audits
  for select using (
    auth.uid() = reviewer_id or
    auth.uid() in (select tp.user_id from public.nexus_talent_profiles tp join public.nexus_time_logs tl on tp.id = tl.talent_profile_id where tl.id = time_log_id)
  );

-- Compliance Events: admins only (sensitive audit data)
create policy "Compliance events admin only" on public.nexus_compliance_events
  for select using (exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin'));

create policy "System inserts compliance events" on public.nexus_compliance_events
  for insert with check (true); -- Service role only in practice

-- Escrow Ledger: contract parties
create policy "Escrow visible to contract parties" on public.nexus_escrow_ledger
  for select using (auth.uid() = client_id or auth.uid() = creator_id);

-- Payouts: talent only
create policy "Payouts visible to talent" on public.nexus_payouts
  for select using (
    auth.uid() in (select user_id from public.nexus_talent_profiles where id = talent_profile_id)
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

create trigger nexus_talent_profiles_set_updated_at before update on public.nexus_talent_profiles for each row execute function public.set_updated_at();
create trigger nexus_time_logs_set_updated_at before update on public.nexus_time_logs for each row execute function public.set_updated_at();
create trigger nexus_escrow_ledger_set_updated_at before update on public.nexus_escrow_ledger for each row execute function public.set_updated_at();
create trigger nexus_payouts_set_updated_at before update on public.nexus_payouts for each row execute function public.set_updated_at();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Calculate AZ-eligible hours for a time period
create or replace function public.calculate_az_eligible_hours(
  p_talent_id uuid,
  p_start_date date,
  p_end_date date
) returns numeric as $$
  select coalesce(sum(az_eligible_hours), 0)
  from public.nexus_time_logs
  where talent_profile_id = p_talent_id
    and log_date between p_start_date and p_end_date
    and location_state = 'AZ'
    and submission_status = 'approved';
$$ language sql stable;

-- Get talent compliance summary
create or replace function public.get_talent_compliance_summary(p_user_id uuid)
returns jsonb as $$
  select jsonb_build_object(
    'profile_complete', (tp.legal_first_name is not null and tp.tax_id_encrypted is not null),
    'compliance_status', tp.compliance_status,
    'az_eligible', tp.az_eligible,
    'w9_submitted', tp.w9_submitted,
    'bank_connected', tp.bank_account_connected,
    'pending_time_logs', (select count(*) from public.nexus_time_logs where talent_profile_id = tp.id and submission_status = 'submitted'),
    'total_hours_this_month', (select coalesce(sum(hours_worked), 0) from public.nexus_time_logs where talent_profile_id = tp.id and log_date >= date_trunc('month', now())),
    'az_hours_this_month', (select coalesce(sum(az_eligible_hours), 0) from public.nexus_time_logs where talent_profile_id = tp.id and log_date >= date_trunc('month', now()) and location_state = 'AZ')
  )
  from public.nexus_talent_profiles tp
  where tp.user_id = p_user_id;
$$ language sql stable;

-- ============================================================================
-- COMMENTS
-- ============================================================================

comment on table public.nexus_talent_profiles is 'Talent legal/tax profiles with encrypted PII for compliance';
comment on table public.nexus_time_logs is 'Hour tracking with location for AZ Tax Credit eligibility';
comment on table public.nexus_time_log_audits is 'Audit trail for time log reviews and AZ submissions';
comment on table public.nexus_compliance_events is 'Cross-entity compliance event log for legal separation';
comment on table public.nexus_escrow_ledger is 'Escrow account tracking per contract';
comment on table public.nexus_payouts is 'Payout records with tax form tracking';
comment on function public.calculate_az_eligible_hours is 'Calculate AZ Tax Credit eligible hours for a talent in a date range';
comment on function public.get_talent_compliance_summary is 'Get compliance status summary for a talent';
