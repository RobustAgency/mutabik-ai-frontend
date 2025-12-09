/**
 * AI Risk Treatment Interfaces
 * Based on API specification from RISK_FRONTEND_API_DOCUMENTATION.md
 */

// Enums as per API specification
export enum TreatmentType {
  CORRECTIVE = "corrective",
  PREVENTIVE = "preventive",
  DETECTIVE = "detective",
  TRANSFER_INSURANCE = "transfer_insurance",
  TRANSFER_VENDOR = "transfer_vendor",
  AVOID_CHANGE = "avoid_change",
  OTHER = "other",
}

export enum TreatmentStatus {
  NEW = "new",
  IN_PROGRESS = "in_progress",
  BLOCKED = "blocked",
  PENDING_VERIFICATION = "pending_verification",
  CLOSED = "closed",
  CANCELLED = "cancelled",
}

export enum ResultVerification {
  PENDING = "pending",
  PASSED = "passed",
  FAILED = "failed",
  NOT_APPLICABLE = "not_applicable",
}

export interface AiRiskTreatment {
  id: number;
  ai_risk_register_id: number;
  treatment_type: TreatmentType;
  plan_summary: string;
  owner_stakeholder_id: number;
  assignee: string[] | null;
  due_date: string;
  status: TreatmentStatus;
  expected_residual_level: string | null;
  result_verification: ResultVerification | null;
  evidence_link: string | null;
  linked_capa_id: string | null;
  closed_at: string | null;
  organization_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAiRiskTreatmentData {
  ai_risk_register_id: number;
  treatment_type: TreatmentType;
  plan_summary: string;
  owner_stakeholder_id: number;
  assignee?: string[];
  due_date: string;
  status: TreatmentStatus;
  expected_residual_level?: string;
  result_verification?: ResultVerification;
  evidence_link?: string;
  linked_capa_id?: string;
  closed_at?: string;
}

export interface UpdateAiRiskTreatmentData {
  ai_risk_register_id?: number;
  treatment_type?: TreatmentType;
  plan_summary?: string;
  owner_stakeholder_id?: number;
  assignee?: string[];
  due_date?: string;
  status?: TreatmentStatus;
  expected_residual_level?: string;
  result_verification?: ResultVerification;
  evidence_link?: string;
  linked_capa_id?: string;
  closed_at?: string;
}

export interface AiRiskTreatmentFilters {
  treatment_type?: TreatmentType;
  status?: TreatmentStatus;
  per_page?: number;
}

