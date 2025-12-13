export type TaxClassification = 'w2_employee' | '1099_contractor' | 'corp_entity' | 'foreign';
export type ComplianceStatus = 'pending' | 'verified' | 'expired' | 'rejected' | 'review_needed';
export type PayoutMethod = 'stripe' | 'ach' | 'check' | 'paypal';
export type LocationType = 'remote' | 'onsite' | 'hybrid';
export type SubmissionStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'exported';
export type AuditType = 'review' | 'approval' | 'rejection' | 'az_submission' | 'correction' | 'dispute';
export type AuditDecision = 'approved' | 'rejected' | 'needs_correction' | 'submitted' | 'acknowledged';
export type AzSubmissionStatus = 'pending' | 'accepted' | 'rejected' | 'error';
export type EventCategory = 'compliance' | 'financial' | 'access' | 'data_change' | 'tax_reporting' | 'legal';
export type EscrowStatus = 'unfunded' | 'funded' | 'partially_funded' | 'released' | 'disputed' | 'refunded';
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface NexusTalentProfile {
  id: string;
  user_id: string;
  legal_first_name?: string;
  legal_last_name?: string;
  tax_id_last_four?: string;
  tax_classification?: TaxClassification;
  residency_state?: string;
  residency_country: string;
  address_city?: string;
  address_state?: string;
  address_zip?: string;
  compliance_status: ComplianceStatus;
  compliance_verified_at?: string;
  compliance_expires_at?: string;
  az_eligible: boolean;
  w9_submitted: boolean;
  w9_submitted_at?: string;
  bank_account_connected: boolean;
  stripe_connect_account_id?: string;
  payout_method?: PayoutMethod;
  created_at: string;
  updated_at: string;
}

export interface NexusTimeLog {
  id: string;
  talent_profile_id: string;
  contract_id?: string;
  milestone_id?: string;
  log_date: string;
  start_time: string;
  end_time: string;
  hours_worked: number;
  description?: string;
  task_category?: string;
  location_type: LocationType;
  location_state?: string;
  location_city?: string;
  location_latitude?: number;
  location_longitude?: number;
  location_verified: boolean;
  az_eligible_hours: number;
  billable: boolean;
  billed: boolean;
  billed_at?: string;
  invoice_id?: string;
  submission_status: SubmissionStatus;
  submitted_at?: string;
  approved_at?: string;
  approved_by?: string;
  tax_period?: string;
  created_at: string;
  updated_at: string;
}

export interface NexusTimeLogAudit {
  id: string;
  time_log_id: string;
  reviewer_id?: string;
  audit_type: AuditType;
  decision?: AuditDecision;
  notes?: string;
  corrections_made?: Record<string, { old: unknown; new: unknown }>;
  az_submission_id?: string;
  az_submission_status?: AzSubmissionStatus;
  az_submission_response?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface NexusComplianceEvent {
  id: string;
  entity_type: string;
  entity_id: string;
  event_type: string;
  event_category: EventCategory;
  actor_id?: string;
  actor_role?: string;
  realm_context?: string;
  description?: string;
  payload?: Record<string, unknown>;
  sensitive_data_accessed: boolean;
  financial_amount?: number;
  legal_entity?: string;
  cross_entity_access: boolean;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface NexusEscrowLedger {
  id: string;
  contract_id: string;
  client_id: string;
  creator_id: string;
  escrow_balance: number;
  funds_deposited: number;
  funds_released: number;
  funds_refunded: number;
  aethex_fees: number;
  stripe_customer_id?: string;
  stripe_escrow_intent_id?: string;
  status: EscrowStatus;
  funded_at?: string;
  released_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NexusPayout {
  id: string;
  talent_profile_id: string;
  contract_id?: string;
  payment_id?: string;
  gross_amount: number;
  platform_fee: number;
  processing_fee: number;
  tax_withholding: number;
  net_amount: number;
  payout_method: PayoutMethod;
  stripe_payout_id?: string;
  ach_trace_number?: string;
  check_number?: string;
  status: PayoutStatus;
  scheduled_date?: string;
  processed_at?: string;
  failure_reason?: string;
  tax_year: number;
  tax_form_type?: string;
  tax_form_generated: boolean;
  tax_form_file_id?: string;
  created_at: string;
  updated_at: string;
}

export interface FoundationGigRadarItem {
  opportunity_id: string;
  title: string;
  category: string;
  required_skills: string[];
  timeline_type: string;
  location_requirement: string;
  required_experience: string;
  status: string;
  published_at: string;
  availability_status: 'available' | 'in_progress' | 'filled';
  applicant_count: number;
  compensation_type: 'hourly' | 'project';
}

export interface TalentComplianceSummary {
  profile_complete: boolean;
  compliance_status: ComplianceStatus;
  az_eligible: boolean;
  w9_submitted: boolean;
  bank_connected: boolean;
  pending_time_logs: number;
  total_hours_this_month: number;
  az_hours_this_month: number;
}

export interface TimeLogCreateRequest {
  contract_id?: string;
  milestone_id?: string;
  log_date: string;
  start_time: string;
  end_time: string;
  hours_worked: number;
  description?: string;
  task_category?: string;
  location_type: LocationType;
  location_state?: string;
  location_city?: string;
  location_latitude?: number;
  location_longitude?: number;
}

export interface TimeLogSubmitRequest {
  time_log_ids: string[];
}

export interface TimeLogApproveRequest {
  time_log_id: string;
  decision: 'approved' | 'rejected' | 'needs_correction';
  notes?: string;
}

export interface TalentProfileUpdateRequest {
  legal_first_name?: string;
  legal_last_name?: string;
  tax_classification?: TaxClassification;
  residency_state?: string;
  residency_country?: string;
  address_city?: string;
  address_state?: string;
  address_zip?: string;
}

export interface AzExportRequest {
  start_date: string;
  end_date: string;
  talent_ids?: string[];
}

export interface AzExportResponse {
  export_id: string;
  total_hours: number;
  az_eligible_hours: number;
  talent_count: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  download_url?: string;
}
