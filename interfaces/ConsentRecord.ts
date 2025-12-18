export type ConsentStatus = "granted" | "denied" | "withdrawn" | "expired";

export type ConsentLifecycle =
  | "obtained"
  | "active"
  | "expiring"
  | "expired"
  | "withdrawn";

export type ConsentPurpose =
  | "marketing"
  | "ai_training"
  | "profiling"
  | "personalization"
  | "biometrics"
  | "cctv"
  | "analytics"
  | "research";

export type ConsentMethod =
  | "explicit_opt_in"
  | "implied"
  | "pre_checked"
  | "verbal"
  | "written";

export type ConsentSourceSystem =
  "portal"
  | "mobile_app"
  | "crm"
  | "call_center"
  | "admin"
  | "email"
  | "website";

export type ConsentLanguage = "en" | "ar" | "fr" | "es";

export type ConsentJurisdiction =
  | "eu"
  | "uae"
  | "uk"
  | "ksa"
  | "difc"
  | "us_ca";

export type ConsentSubjectRealm =
  | "customer"
  | "employee"
  | "vendor"
  | "student"
  | "patient"
  | "visitor";

export type ConsentDataCategory =
  | "name"
  | "contact"
  | "identifier"
  | "financial"
  | "health"
  | "biometric"
  | "behavioral"
  | "sensitive"
  | "children"
  | "location";

export interface ConsentRecord {
  id: number;
  consent_code: string;
  subject_key: string;
  subject_realm: ConsentSubjectRealm;
  subject_age_group: string | null;
  purpose: ConsentPurpose;
  record_of_processing_activity_id: number;
  status: ConsentStatus;
  lifecycle_stage: ConsentLifecycle;
  consent_version: number;
  consent_text: string;
  consent_method: ConsentMethod;
  effective_from: string;
  effective_to: string | null;
  obtained_date: string | null;
  withdrawal_date: string | null;
  last_refreshed_date: string | null;
  source_system: ConsentSourceSystem;
  evidence_uri: string | null;
  ip_address: string | null;
  user_agent: string | null;
  language: ConsentLanguage;
  jurisdiction: ConsentJurisdiction;
  data_categories: ConsentDataCategory[];
  can_withdraw: boolean;
  withdrawal_method: string;
  created_at: string;
  updated_at: string;
}

export interface ConsentRecordFilters {
  subject_realm?: ConsentSubjectRealm | null;
  status?: ConsentStatus | null;
  lifecycle_stage?: ConsentLifecycle | null;
  language?: ConsentLanguage | null;
  jurisdiction?: ConsentJurisdiction | null;
  per_page?: number;
  page?: number;
}

export interface CreateConsentRecordData {
  subject_key: string;
  subject_realm: ConsentSubjectRealm;
  subject_age_group?: string | null;
  purpose: ConsentPurpose;
  record_of_processing_activity_id: number;
  status: ConsentStatus;
  lifecycle_stage: ConsentLifecycle;
  consent_version: number;
  consent_text: string;
  consent_method: ConsentMethod;
  effective_from: string;
  effective_to?: string | null;
  last_refreshed_date?: string | null;
  source_system: ConsentSourceSystem;
  evidence_uri?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  language: ConsentLanguage;
  jurisdiction: ConsentJurisdiction;
  data_categories: ConsentDataCategory[];
  can_withdraw: boolean;
  withdrawal_method: string;
}


