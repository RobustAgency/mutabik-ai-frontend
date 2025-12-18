export type PrivacyIncidentStatus =
  | "detected"
  | "under_investigation"
  | "contained"
  | "notified"
  | "remediation"
  | "resolved"
  | "closed";

export type PrivacyIncidentType =
  | "unauthorized_access"
  | "data_exposure"
  | "lost_device"
  | "stolen_device"
  | "misdelivery"
  | "ransomware"
  | "phishing"
  | "system_breach"
  | "human_error"
  | "third_party";

export type PrivacyIncidentRiskLevel = "low" | "medium" | "high" | "severe";

export type PrivacyIncidentNotificationRequired =
  | "none"
  | "authority"
  | "subjects"
  | "both";

export type PrivacyIncidentNotificationStatus =
  | "pending"
  | "not_required"
  | "in_progress"
  | "authority_notified"
  | "subjects_notified"
  | "completed";

export type PrivacyIncidentNotificationMethod =
  | "email"
  | "letter"
  | "phone"
  | "SMS"
  | "website"
  | "media_announcement";

export type PrivacyIncidentDataCategory =
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

export type PrivacyIncidentBreachCriteria =
  | "confidentiality"
  | "integrity"
  | "availability";

export interface PrivacyIncident {
  id: number;
  organization_id: number;
  incident_code: string;
  incident_title: string;
  incident_type: PrivacyIncidentType;
  risk_level: PrivacyIncidentRiskLevel;
  is_breach: boolean;
  breach_criteria_met: PrivacyIncidentBreachCriteria[] | null;
  detected_date: string;
  occurred_date: string | null;
  notification_deadline: string | null;
  hours_to_deadline: number | null;
  is_deadline_passed: boolean;
  incident_description: string;
  what_happened: string;
  how_discovered: string;
  data_compromised: string;
  data_categories_affected: PrivacyIncidentDataCategory[];
  estimated_affected_subjects: number;
  affected_subject_keys: string[] | null;
  notification_required: PrivacyIncidentNotificationRequired;
  notification_status: PrivacyIncidentNotificationStatus;
  authority_notified: boolean;
  authority_notification_date: string | null;
  supervisory_authority: string | null;
  authority_reference_number: string | null;
  authority_response: string | null;
  subjects_notified: boolean;
  subject_notification_date: string | null;
  notification_method: PrivacyIncidentNotificationMethod | null;
  notification_template_used: string | null;
  immediate_actions: string;
  mitigation_measures: string;
  preventive_measures: string;
  root_cause_analysis: string | null;
  responsible_party: string | null;
  lessons_learned: string | null;
  status: PrivacyIncidentStatus;
  resolution_date: string | null;
  days_to_resolution: number | null;
  processing_activity_ids: number[] | null;
  affected_systems: string[];
  third_party_involved: boolean;
  vendor_id: number | null;
  evidence_uris: string[] | null;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

export interface PrivacyIncidentFilters {
  incident_type?: PrivacyIncidentType | null;
  risk_level?: PrivacyIncidentRiskLevel | null;
  status?: PrivacyIncidentStatus | null;
  is_breach?: boolean | null;
  per_page?: number;
  page?: number;
}

export interface CreatePrivacyIncidentData {
  incident_title: string;
  incident_type: PrivacyIncidentType;
  risk_level: PrivacyIncidentRiskLevel;
  is_breach: boolean;
  breach_criteria_met?: PrivacyIncidentBreachCriteria[] | null;
  detected_date: string;
  occurred_date?: string | null;
  hours_to_deadline?: number | null;
  is_deadline_passed?: boolean;
  incident_description: string;
  what_happened: string;
  how_discovered: string;
  data_compromised: string;
  data_categories_affected: PrivacyIncidentDataCategory[];
  estimated_affected_subjects: number;
  affected_subject_keys?: string[] | null;
  notification_required: PrivacyIncidentNotificationRequired;
  notification_status: PrivacyIncidentNotificationStatus;
  authority_notified: boolean;
  authority_notification_date?: string | null;
  supervisory_authority?: string | null;
  authority_reference_number?: string | null;
  authority_response?: string | null;
  subjects_notified: boolean;
  subject_notification_date?: string | null;
  notification_method?: PrivacyIncidentNotificationMethod | null;
  notification_template_used?: string | null;
  immediate_actions: string;
  mitigation_measures: string;
  preventive_measures: string;
  root_cause_analysis?: string | null;
  responsible_party?: string | null;
  lessons_learned?: string | null;
  status: PrivacyIncidentStatus;
  resolution_date?: string | null;
  processing_activity_ids?: number[] | null;
  affected_systems: string[];
  third_party_involved: boolean;
  vendor_id?: number | null;
  evidence_uris?: string[] | null;
}

