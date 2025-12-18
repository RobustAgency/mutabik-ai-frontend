export type ROPAStatus = "draft" | "active" | "under_review" | "archived";

export interface RecordOfProcessingActivity {
  id: number;
  activity_name: string;
  purpose: string;
  detailed_purpose: string | null;
  owner_team: string;
  controller_role: string;
  data_subject_categories: string[];
  data_categories: string[];
  contains_pii: boolean;
  consent_required: boolean;
  lawful_basis: string;
  legitimate_interest_assessment: string | null;
  consent_coverage_percent: number | null;
  dpia_required: boolean;
  dpia_status: string | null;
  dpia_id: number | null;
  retention_period: string;
  retention_justification: string;
  has_international_transfers: boolean;
  applicable_jurisdictions: string[];
  linked_dataset_ids: number[];
  linked_ai_models_ids: number[];
  security_measures: string;
  internal_recipients: string[];
  external_recipients: string[];
  status: ROPAStatus;
  last_reviewed_date: string | null;
  next_review_date: string | null;
  created_by: number;
  updated_by: number;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface ROPAFilters {
  status?: ROPAStatus | null;
  owner_team?: string | null;
  from?: string | null; // date (ISO 8601)
  to?: string | null; // date (ISO 8601)
  per_page?: number; // 1-100, default: 15
  page?: number;
}

export interface CreateROPAData {
  activity_name: string;
  purpose: string;
  detailed_purpose?: string | null;
  owner_team: string;
  controller_role: string;
  data_subject_categories: string[];
  data_categories: string[];
  contains_pii?: boolean;
  consent_required?: boolean;
  lawful_basis: string;
  legitimate_interest_assessment?: string | null;
  consent_coverage_percent?: number | null;
  dpia_required?: boolean;
  dpia_status?: string | null;
  dpia_id?: number | null;
  retention_period: string;
  retention_justification: string;
  has_international_transfers?: boolean;
  applicable_jurisdictions: string[];
  linked_dataset_ids?: number[];
  linked_ai_models_ids?: number[];
  security_measures: string;
  internal_recipients?: string[];
  external_recipients?: string[];
  status: ROPAStatus;
  last_reviewed_date?: string | null;
  next_review_date?: string | null;
}

