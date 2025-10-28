export interface FormDataType {
  title: string;
  description: string | null;
  status:
    | "draft"
    | "under_review"
    | "approved"
    | "in_development"
    | "testing"
    | "staging"
    | "active"
    | "suspended"
    | "deprecated";
  business_domain: string;
  business_objective: string;
  business_owner_email: string;
  technical_owner_email: string;
  regulatory_scope: string[];
  data_sensitivity: "public" | "internal" | "confidential" | "restricted";
  go_live_date: string | null;

  expected_roi: number | null;
  implementation_cost: number | null;
  reduction_in_time: number | null;
  reduction_in_cost: number | null;
  increase_in_revenue: number | null;
  risk_avoidance: number | null;
  fte_capacity_saved: number | null;

  use_case_type: string;
  value_driver: string;

  overall_risk_score: number | null;
  risk_level: "low" | "medium" | "high" | "critical";
  human_oversight_mode: string;
  dpia: boolean;
  aia: boolean;

  data_availability_status: string;
  data_readiness_level: string;
  data_freshness: string;
}
