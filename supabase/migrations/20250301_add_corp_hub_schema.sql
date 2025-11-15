-- CORP: Enterprise Client Portal Schema
-- For invoicing, contracts, team management, and reporting

-- ============================================================================
-- INVOICES & BILLING
-- ============================================================================

create table if not exists public.corp_invoices (
  id uuid primary key default gen_random_uuid(),
  client_company_id uuid not null references public.user_profiles(id) on delete cascade,
  invoice_number text not null unique,
  project_id uuid,
  description text,
  issue_date date not null default now(),
  due_date date not null,
  amount_due numeric(12, 2) not null,
  amount_paid numeric(12, 2) not null default 0,
  status text not null default 'draft' check (status in ('draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled')),
  currency text not null default 'USD',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists corp_invoices_client_idx on public.corp_invoices (client_company_id);
create index if not exists corp_invoices_status_idx on public.corp_invoices (status);
create index if not exists corp_invoices_due_date_idx on public.corp_invoices (due_date);
create index if not exists corp_invoices_number_idx on public.corp_invoices (invoice_number);

-- Invoice Line Items
create table if not exists public.corp_invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.corp_invoices(id) on delete cascade,
  description text not null,
  quantity numeric(10, 2) not null default 1,
  unit_price numeric(12, 2) not null,
  amount numeric(12, 2) not null,
  category text, -- 'service', 'product', 'license', etc.
  created_at timestamptz not null default now()
);

create index if not exists corp_invoice_items_invoice_idx on public.corp_invoice_items (invoice_id);

-- Payments received on invoices
create table if not exists public.corp_invoice_payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.corp_invoices(id) on delete cascade,
  amount_paid numeric(12, 2) not null,
  payment_date date not null default now(),
  payment_method text not null default 'bank_transfer', -- 'stripe', 'bank_transfer', 'check', etc.
  reference_number text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists corp_invoice_payments_invoice_idx on public.corp_invoice_payments (invoice_id);

-- ============================================================================
-- CONTRACTS & AGREEMENTS
-- ============================================================================

create table if not exists public.corp_contracts (
  id uuid primary key default gen_random_uuid(),
  client_company_id uuid not null references public.user_profiles(id) on delete cascade,
  vendor_id uuid not null references public.user_profiles(id) on delete cascade,
  contract_name text not null,
  contract_type text not null check (contract_type in ('service', 'retainer', 'license', 'nda', 'other')),
  description text,
  start_date date,
  end_date date,
  contract_value numeric(12, 2),
  status text not null default 'draft' check (status in ('draft', 'pending_approval', 'signed', 'active', 'completed', 'terminated', 'archived')),
  document_url text, -- URL to signed document
  signed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists corp_contracts_client_idx on public.corp_contracts (client_company_id);
create index if not exists corp_contracts_vendor_idx on public.corp_contracts (vendor_id);
create index if not exists corp_contracts_status_idx on public.corp_contracts (status);

-- Contract Milestones
create table if not exists public.corp_contract_milestones (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.corp_contracts(id) on delete cascade,
  milestone_name text not null,
  description text,
  due_date date,
  deliverables text,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists corp_contract_milestones_contract_idx on public.corp_contract_milestones (contract_id);

-- ============================================================================
-- TEAM COLLABORATION
-- ============================================================================

create table if not exists public.corp_team_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.user_profiles(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member', 'viewer')),
  email text not null,
  full_name text,
  job_title text,
  status text not null default 'active' check (status in ('active', 'inactive', 'pending_invite')),
  invited_at timestamptz,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(company_id, user_id)
);

create index if not exists corp_team_members_company_idx on public.corp_team_members (company_id);
create index if not exists corp_team_members_user_idx on public.corp_team_members (user_id);

-- Activity Log (for audit trail)
create table if not exists public.corp_activity_log (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.user_profiles(id) on delete cascade,
  actor_id uuid not null references public.user_profiles(id) on delete cascade,
  action text not null, -- 'created_invoice', 'sent_contract', 'paid_invoice', etc.
  resource_type text, -- 'invoice', 'contract', 'team_member'
  resource_id uuid,
  metadata jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists corp_activity_log_company_idx on public.corp_activity_log (company_id);
create index if not exists corp_activity_log_actor_idx on public.corp_activity_log (actor_id);
create index if not exists corp_activity_log_created_idx on public.corp_activity_log (created_at desc);

-- ============================================================================
-- PROJECTS & TRACKING
-- ============================================================================

create table if not exists public.corp_projects (
  id uuid primary key default gen_random_uuid(),
  client_company_id uuid not null references public.user_profiles(id) on delete cascade,
  project_name text not null,
  description text,
  status text not null default 'active' check (status in ('planning', 'active', 'paused', 'completed', 'archived')),
  budget numeric(12, 2),
  spent numeric(12, 2) default 0,
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists corp_projects_client_idx on public.corp_projects (client_company_id);
create index if not exists corp_projects_status_idx on public.corp_projects (status);

-- ============================================================================
-- ANALYTICS & REPORTING
-- ============================================================================

create table if not exists public.corp_financial_summary (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null unique references public.user_profiles(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  total_invoiced numeric(12, 2) default 0,
  total_paid numeric(12, 2) default 0,
  total_overdue numeric(12, 2) default 0,
  active_contracts int default 0,
  completed_contracts int default 0,
  total_contract_value numeric(12, 2) default 0,
  average_payment_days int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists corp_financial_summary_company_idx on public.corp_financial_summary (company_id);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

alter table public.corp_invoices enable row level security;
alter table public.corp_invoice_items enable row level security;
alter table public.corp_invoice_payments enable row level security;
alter table public.corp_contracts enable row level security;
alter table public.corp_contract_milestones enable row level security;
alter table public.corp_team_members enable row level security;
alter table public.corp_activity_log enable row level security;
alter table public.corp_projects enable row level security;
alter table public.corp_financial_summary enable row level security;

-- Invoices: client and team members can view
create policy "Invoices visible to client and team" on public.corp_invoices
  for select using (
    auth.uid() = client_company_id or
    exists(select 1 from public.corp_team_members where company_id = client_company_id and user_id = auth.uid())
  );

create policy "Client creates invoices" on public.corp_invoices
  for insert with check (auth.uid() = client_company_id);

create policy "Client manages invoices" on public.corp_invoices
  for update using (auth.uid() = client_company_id);

-- Contracts: parties involved can view
create policy "Contracts visible to involved parties" on public.corp_contracts
  for select using (
    auth.uid() = client_company_id or auth.uid() = vendor_id or
    exists(select 1 from public.corp_team_members where company_id = client_company_id and user_id = auth.uid())
  );

-- Team: company members can view
create policy "Team members visible to company" on public.corp_team_members
  for select using (
    auth.uid() = company_id or
    exists(select 1 from public.corp_team_members where company_id = company_id and user_id = auth.uid())
  );

-- Activity: company members can view
create policy "Activity visible to company" on public.corp_activity_log
  for select using (
    exists(select 1 from public.corp_team_members where company_id = company_id and user_id = auth.uid())
  );

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

create trigger corp_invoices_set_updated_at before update on public.corp_invoices for each row execute function public.set_updated_at();
create trigger corp_contracts_set_updated_at before update on public.corp_contracts for each row execute function public.set_updated_at();
create trigger corp_contract_milestones_set_updated_at before update on public.corp_contract_milestones for each row execute function public.set_updated_at();
create trigger corp_team_members_set_updated_at before update on public.corp_team_members for each row execute function public.set_updated_at();
create trigger corp_projects_set_updated_at before update on public.corp_projects for each row execute function public.set_updated_at();
create trigger corp_financial_summary_set_updated_at before update on public.corp_financial_summary for each row execute function public.set_updated_at();

-- ============================================================================
-- COMMENTS
-- ============================================================================

comment on table public.corp_invoices is 'Invoices issued by the company to clients';
comment on table public.corp_invoice_items is 'Line items on invoices';
comment on table public.corp_invoice_payments is 'Payments received on invoices';
comment on table public.corp_contracts is 'Contracts with vendors and clients';
comment on table public.corp_team_members is 'Team members with access to the hub';
comment on table public.corp_activity_log is 'Audit trail of all activities';
comment on table public.corp_projects is 'Client projects for tracking work';
comment on table public.corp_financial_summary is 'Financial summary and metrics';
