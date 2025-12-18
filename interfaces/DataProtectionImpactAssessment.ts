export type DPIAStatus =
  | "draft"
  | "in_progress"
  | "dpo_review"
  | "pending_approval"
  | "completed"
  | "archived";

export type DPIAStage =
  | "screening"
  | "necessity"
  | "risk_identification"
  | "mitigation"
  | "dpo_consultation"
  | "approval"
  | "completed";

export type DPIARiskLevel = "low" | "medium" | "high" | "critical";

export type DPIAResidualRiskLevel = "low" | "medium" | "high";

export type DPIAFinalDecision =
  | "approved"
  | "approved_with_conditions"
  | "rejected"
  | "deferred";

export type DPIALinkedAssetsType =
  | "ai_model"
  | "system"
  | "process"
  | "technology";

export type DPIAJurisdiction = "eu" | "uae" | "uk" | "ksa" | "difc";

export interface DataProtectionImpactAssessment {
  id: number;
  dpia_code: string;
  dpia_name: string;
  ropa_id: number;
  linked_ai_model_id: number | null;
  linked_asset_type: DPIALinkedAssetsType;
  automated_trigger: boolean;
  trigger_reason: string;
  risk_level: DPIARiskLevel;
  risk_score: number;
  stage: DPIAStage;
  completion_percentage: number;
  necessity_justification: string | null;
  proportionality_assessment: string;
  alternatives_considered: string;
  identified_risks: string | null;
  likelihood_assessment: string;
  impact_assessment: string;
  mitigation_measures: string | null;
  residual_risk_level: DPIAResidualRiskLevel | null;
  dpo_consulted: boolean | null;
  dpo_consultation_date: string | null;
  dpo_advice: string | null;
  dpo_user_id: number | null;
  stakeholders_consulted: number[] | null;
  stakeholder_feedback: string | null;
  data_subjects_consulted: boolean;
  consultation_method: string | null;
  final_decision: DPIAFinalDecision | null;
  approval_date: string | null;
  approved_by: number | null;
  conditions: string | null;
  status: DPIAStatus;
  review_frequency_months: number;
  next_review_date?: string | null;
  applicable_jurisdictions: DPIAJurisdiction[];
  created_by?: number;
  updated_by?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DPIAFilters {
  name?: string | null;
  status?: DPIAStatus | null;
  stage?: DPIAStage | null;
  risk_level?: DPIARiskLevel | null;
  per_page?: number;
  page?: number;
}

export interface CreateDPIAData {
  dpia_name: string;
  ropa_id: number;
  linked_ai_model_id?: number | null;
  linked_asset_type: DPIALinkedAssetsType;
  automated_trigger: boolean;
  trigger_reason: string;
  risk_level: DPIARiskLevel;
  risk_score: number;
  stage: DPIAStage;
  completion_percentage: number;
  necessity_justification?: string | null;
  proportionality_assessment: string;
  alternatives_considered: string;
  identified_risks?: string | null;
  likelihood_assessment: string;
  impact_assessment: string;
  mitigation_measures?: string | null;
  residual_risk_level?: DPIAResidualRiskLevel | null;
  dpo_consulted?: boolean | null;
  dpo_consultation_date?: string | null;
  dpo_advice?: string | null;
  dpo_user_id?: number | null;
  stakeholders_consulted?: number[] | null;
  stakeholder_feedback?: string | null;
  data_subjects_consulted: boolean;
  consultation_method?: string | null;
  final_decision?: DPIAFinalDecision | null;
  approval_date?: string | null;
  approved_by?: number | null;
  conditions?: string | null;
  status: DPIAStatus;
  review_frequency_months: number;
  applicable_jurisdictions: DPIAJurisdiction[];
}


