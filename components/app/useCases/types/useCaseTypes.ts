export interface FormDataType {
  // Core fields
  name: string;
  description: string | null;
  business_objective: string;
  business_owner_id: string | null;
  technical_owner_id: string | null;
  business_domain:
    | "customer_service"
    | "fraud_detection"
    | "marketing"
    | "operations"
    | "risk_management"
    | "hr"
    | "finance"
    | "legal"
    | "product_development"
    | "supply_chain"
    | "";

  // Classification and Priority
  roi_classification: "High" | "Medium" | "Low" | "";
  priority: "High" | "Medium" | "Low" | "";
  risk_level: "low" | "medium" | "high" | "critical";
  data_sensitivity: "public" | "internal" | "confidential" | "restricted";

  // Financial and Timeline
  expected_roi_percentage: number | null;
  budget_allocated: number | null;
  target_go_live_date: string | null;

  // Status and Tracking
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
  created_by: string;
  updated_by: string | null;

  // Assessment Flags
  roi_assessment: boolean;
  risk_assessment: boolean;
  data_assessment: boolean;

  // Estimated Values
  estimated_implementation_cost: number | null;
  estimated_reduction_in_time: number | null;
  estimated_reduction_in_cost: number | null;
  estimated_revenue_increase: number | null;
  estimated_fte_capacity_saving: number | null;

  // Data Status
  data_availability_status:
    | "available"
    | "partially_available"
    | "not_available"
    | "";
  data_readiness: "D1" | "D2" | "D3" | "D4" | "";
}
