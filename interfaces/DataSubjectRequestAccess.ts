export type DSARStatus =
  | "new"
  | "pending_verification"
  | "in_progress"
  | "pending_approval"
  | "ready_for_response"
  | "completed"
  | "rejected"
  | "cancelled";

export type DSARPriority = "low" | "normal" | "high" | "urgent";

export type DSARRequestType =
  | "access"
  | "rectification"
  | "erasure"
  | "restriction"
  | "portability"
  | "objection"
  | "opt_out_marketing"
  | "ai_explainability"
  | "automated_decision_challenge";

export type DSARSubjectRealm =
  | "customer"
  | "employee"
  | "vendor"
  | "student"
  | "patient";

export type DSARVerificationStatus =
  | "pending"
  | "in_progress"
  | "verified"
  | "rejected"
  | "failed";

export type DSARVerificationMethod =
  | "email_link"
  | "sms_code"
  | "id_document"
  | "in_person"
  | "callback";

export type DSARRequestSource =
  | "email"
  | "web_form"
  | "phone"
  | "letter"
  | "in_person";

export type DSARResponseMethod =
  | "email"
  | "secure_portal"
  | "encrypted_file"
  | "physical_mail"
  | "in_person";

export type DSARResponseFormat =
  | "pdf"
  | "json"
  | "csv"
  | "excel"
  | "portal_access"
  | "physical_copy";

export interface DataSubjectRequestAccess {
  id: number;
  request_code: string;
  request_type: DSARRequestType;
  subject_identifier: string;
  subject_key: string | null;
  subject_name: string | null;
  subject_realm: DSARSubjectRealm;
  verification_status: DSARVerificationStatus;
  verification_method: DSARVerificationMethod | null;
  verification_date: string | null;
  verified_by: number | null;
  request_details: string;
  requested_data_categories: string[] | null;
  request_source: DSARRequestSource;
  submitted_date: string;
  due_date: string;
  extended_due_date: string | null;
  response_date: string | null;
  completed_date: string | null;
  status: DSARStatus;
  priority: DSARPriority;
  is_overdue: boolean;
  assigned_to: number;
  assigned_date: string;
  response_method: DSARResponseMethod | null;
  response_format: DSARResponseFormat | null;
  response_uri: string | null;
  response_notes: string | null;
  rejection_reason: string | null;
  jurisdiction: string | null;
  processing_activity_ids: number[] | null;
  systems_checked: string[];
  records_found: number | null;
  remaining_days?: number | null;
  created_at: string;
  updated_at: string;
}

export interface DSARFilters {
  status?: DSARStatus | null;
  request_type?: DSARRequestType | null;
  verification_status?: DSARVerificationStatus | null;
  jurisdiction?: string | null;
  subject_realm?: DSARSubjectRealm | null;
  priority?: DSARPriority | null;
  per_page?: number;
  page?: number;
}

export interface CreateDSARData {
  request_type: DSARRequestType;
  subject_identifier: string;
  subject_name?: string | null;
  subject_realm: DSARSubjectRealm;
  verification_status: DSARVerificationStatus;
  subject_key?: string | null;
  verification_method?: DSARVerificationMethod | null;
  verified_by?: number | null;
  request_details: string;
  requested_data_categories?: string[] | null;
  request_source: DSARRequestSource;
  submitted_date: string;
  due_date: string;
  extended_due_date?: string | null;
  status: DSARStatus;
  response_date?: string | null;
  completed_date?: string | null;
  priority: DSARPriority;
  is_overdue: boolean;
  assigned_to: number;
  assigned_date: string;
  response_method?: DSARResponseMethod | null;
  response_format?: DSARResponseFormat | null;
  response_uri?: string | null;
  response_notes?: string | null;
  rejection_reason?: string | null;
  jurisdiction?: string | null;
  processing_activity_ids?: number[] | null;
  systems_checked: string[];
  records_found?: number | null;
}


