/**
 * AI Risk Register Interfaces
 * Based on API specification from RISK_FRONTEND_API_DOCUMENTATION.md
 */

// Enums as per API specification
export enum RiskCategory {
  SAFETY = "safety",
  PRIVACY = "privacy",
  BIAS_FAIRNESS = "bias_fairness",
  SECURITY = "security",
  ROBUSTNESS = "robustness",
  EXPLAINABILITY = "explainability",
  LEGAL_COMPLIANCE = "legal_compliance",
  ETHICS = "ethics",
  AVAILABILITY = "availability",
  RESILIENCE = "resilience",
  VENDOR = "vendor",
  COST = "cost",
  REPUTATION = "reputation",
  OTHER = "other",
}

export enum RiskLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum RiskDecision {
  TREAT = "treat",
  ACCEPT = "accept",
  TRANSFER = "transfer",
  AVOID = "avoid",
}

export enum ReviewCadence {
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  SEMI_ANNUAL = "semi_annual",
  ANNUAL = "annual",
}

export enum RiskStatus {
  IDENTIFIED = "identified",
  ASSESSED = "assessed",
  IN_TREATMENT = "in_treatment",
  ACCEPTED = "accepted",
  TRANSFERRED = "transferred",
  CLOSED = "closed",
}

export interface AiRiskRegister {
  id: number;
  title: string;
  risk_category: RiskCategory;
  ai_model_id: number;
  ai_model_version_id: number | null;
  use_case_id: number | null;
  description: string;
  related_controls: string[];
  risk_methodology_id: number;
  likelihood_code: string;
  impact_code: string;
  inherent_score: string | null;
  residual_score: string | null;
  risk_level: RiskLevel;
  decision: RiskDecision;
  risk_owner: number;
  review_cadence: ReviewCadence;
  next_review_due: string;
  status: RiskStatus;
  linked_assessment_id: number | null;
  linked_incident_id: number | null;
  linked_capa_id: number | null;
  evidence_link: string | null;
  likelihood_label_snapshot: string | null;
  impact_label_snapshot: string | null;
  method_name_snapshot: string | null;
  created_by: string;
  organization_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAiRiskRegisterData {
  title: string;
  risk_category: RiskCategory;
  ai_model_id: number;
  ai_model_version_id?: number;
  use_case_id?: number;
  description: string;
  related_controls?: string[];
  risk_methodology_id: number;
  likelihood_code: string;
  impact_code: string;
  inherent_score?: string;
  residual_score?: string;
  risk_level: RiskLevel;
  decision: RiskDecision;
  risk_owner: number;
  review_cadence: ReviewCadence;
  next_review_due: string;
  status: RiskStatus;
  linked_assessment_id?: number;
  linked_incident_id?: number;
  linked_capa_id?: number;
  evidence_link?: string;
  likelihood_label_snapshot?: string;
  impact_label_snapshot?: string;
  method_name_snapshot?: string;
  created_by: string;
}

export interface UpdateAiRiskRegisterData {
  title?: string;
  risk_category?: RiskCategory;
  ai_model_id?: number;
  ai_model_version_id?: number;
  use_case_id?: number;
  description?: string;
  related_controls?: string[];
  risk_methodology_id?: number;
  likelihood_code?: string;
  impact_code?: string;
  inherent_score?: string;
  residual_score?: string;
  risk_level?: RiskLevel;
  decision?: RiskDecision;
  risk_owner?: number;
  review_cadence?: ReviewCadence;
  next_review_due?: string;
  status?: RiskStatus;
  linked_assessment_id?: number;
  linked_incident_id?: number;
  linked_capa_id?: number;
  evidence_link?: string;
  likelihood_label_snapshot?: string;
  impact_label_snapshot?: string;
  method_name_snapshot?: string;
  created_by?: string;
}

export interface AiRiskRegisterFilters {
  per_page?: number;
}

