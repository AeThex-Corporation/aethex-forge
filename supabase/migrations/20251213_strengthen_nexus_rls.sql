-- NEXUS Core: Strengthened RLS Policies for Legal Entity Separation
-- This migration updates RLS policies to enforce:
-- 1. Client/Admin only access to escrow (no creators)
-- 2. Admin access to all sensitive tables
-- 3. Proper INSERT/UPDATE/DELETE policies

-- ============================================================================
-- DROP EXISTING POLICIES (will recreate with stronger rules)
-- ============================================================================

drop policy if exists "Escrow visible to contract parties" on public.nexus_escrow_ledger;
drop policy if exists "Payouts visible to talent" on public.nexus_payouts;
drop policy if exists "Compliance events admin only" on public.nexus_compliance_events;
drop policy if exists "System inserts compliance events" on public.nexus_compliance_events;
drop policy if exists "Time log audit visibility" on public.nexus_time_log_audits;

-- ============================================================================
-- NEXUS ESCROW LEDGER - Client/Admin Only (Legal Entity Separation)
-- Creators should NOT see escrow details - they see contract/payment status instead
-- ============================================================================

-- Clients can view their own escrow records
create policy "Clients view own escrow" on public.nexus_escrow_ledger
  for select using (auth.uid() = client_id);

-- Admins can view all escrow records (for management/reporting)
create policy "Admins view all escrow" on public.nexus_escrow_ledger
  for select using (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- Only clients can insert escrow records (via API with proper validation)
create policy "Clients create escrow" on public.nexus_escrow_ledger
  for insert with check (auth.uid() = client_id);

-- Clients can update their own escrow (funding operations)
create policy "Clients update own escrow" on public.nexus_escrow_ledger
  for update using (auth.uid() = client_id) with check (auth.uid() = client_id);

-- Admins can update any escrow (for disputes/releases)
create policy "Admins update escrow" on public.nexus_escrow_ledger
  for update using (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- ============================================================================
-- NEXUS PAYOUTS - Talent + Admin Access
-- Talent sees their own payouts, Admins manage all
-- ============================================================================

-- Talent can view their own payouts
create policy "Talent views own payouts" on public.nexus_payouts
  for select using (
    auth.uid() in (select user_id from public.nexus_talent_profiles where id = talent_profile_id)
  );

-- Admins can view all payouts
create policy "Admins view all payouts" on public.nexus_payouts
  for select using (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- Only admins can insert/update payouts (payroll processing)
create policy "Admins manage payouts" on public.nexus_payouts
  for all using (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- ============================================================================
-- NEXUS COMPLIANCE EVENTS - Admin Only + Service Insert
-- Sensitive audit trail - admin read, system write
-- ============================================================================

-- Admins can view all compliance events
create policy "Admins view compliance events" on public.nexus_compliance_events
  for select using (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- Only admins can insert compliance events (via adminClient in API)
-- Non-admin users cannot create compliance log entries directly
create policy "Admins insert compliance events" on public.nexus_compliance_events
  for insert with check (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- ============================================================================
-- NEXUS TIME LOG AUDITS - Enhanced Access Control
-- ============================================================================

-- Talent can view audits for their own time logs
create policy "Talent views own time log audits" on public.nexus_time_log_audits
  for select using (
    auth.uid() in (
      select tp.user_id 
      from public.nexus_talent_profiles tp 
      join public.nexus_time_logs tl on tp.id = tl.talent_profile_id 
      where tl.id = time_log_id
    )
  );

-- Reviewers can view audits they created
create policy "Reviewers view own audits" on public.nexus_time_log_audits
  for select using (auth.uid() = reviewer_id);

-- Clients can view audits for time logs on their contracts
create policy "Clients view contract time log audits" on public.nexus_time_log_audits
  for select using (
    exists(
      select 1 from public.nexus_time_logs tl
      join public.nexus_contracts c on tl.contract_id = c.id
      where tl.id = time_log_id and c.client_id = auth.uid()
    )
  );

-- Admins can view all audits
create policy "Admins view all time log audits" on public.nexus_time_log_audits
  for select using (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- Talent can insert audits for their own time logs (submission)
create policy "Talent inserts own time log audits" on public.nexus_time_log_audits
  for insert with check (
    exists(
      select 1 from public.nexus_time_logs tl
      join public.nexus_talent_profiles tp on tl.talent_profile_id = tp.id
      where tl.id = time_log_id and tp.user_id = auth.uid()
    )
  );

-- Clients can insert audits for time logs on their contracts (approval/rejection)
create policy "Clients insert contract time log audits" on public.nexus_time_log_audits
  for insert with check (
    exists(
      select 1 from public.nexus_time_logs tl
      join public.nexus_contracts c on tl.contract_id = c.id
      where tl.id = time_log_id and c.client_id = auth.uid()
    )
  );

-- Admins can insert any audits
create policy "Admins insert time log audits" on public.nexus_time_log_audits
  for insert with check (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- ============================================================================
-- NEXUS TIME LOGS - Add Admin Access
-- ============================================================================

-- Admins can view all time logs (for approval/reporting)
create policy "Admins view all time logs" on public.nexus_time_logs
  for select using (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- Admins can update any time log (for approval workflow)
create policy "Admins update time logs" on public.nexus_time_logs
  for update using (
    exists(select 1 from public.user_profiles where id = auth.uid() and user_type = 'admin')
  );

-- ============================================================================
-- FOUNDATION GIG RADAR - Verify Read-Only Access
-- No financial data exposed - safe for Foundation users
-- ============================================================================

-- Grant select on gig radar view (if not already granted)
grant select on public.foundation_gig_radar to authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

comment on policy "Clients view own escrow" on public.nexus_escrow_ledger is 'Clients can only view escrow records where they are the client';
comment on policy "Admins view all escrow" on public.nexus_escrow_ledger is 'Admins have full visibility for management';
comment on policy "Talent views own payouts" on public.nexus_payouts is 'Talent sees their own payout history';
comment on policy "Admins manage payouts" on public.nexus_payouts is 'Only admins can create/modify payouts (payroll)';
comment on policy "Admins view compliance events" on public.nexus_compliance_events is 'Compliance events are admin-only for audit purposes';
